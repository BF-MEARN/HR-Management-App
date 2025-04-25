import VisaStatus from '../models/VisaStatus.js';
import { sendVisaReminderEmail } from '../utils/emailService.js';

/**
 * @desc    Get all employees with pending visa steps
 * @route   GET /api/hr/visa/in-progress
 * @access  HR only
 */
export const getInProgressVisaStatuses = async (req, res) => {
  try {
    const pendingEmployees = await VisaStatus.find({
      'workAuthorization.type': 'F1',
      $or: [
        { 'optReceipt.status': { $ne: 'Approved' } },
        { 'optEAD.status': { $ne: 'Approved' } },
        { 'i983.status': { $ne: 'Approved' } },
        { 'i20.status': { $ne: 'Approved' } },
      ],
    })
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .lean();

    res.status(200).json(pendingEmployees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch in-progress statuses', error: err.message });
  }
};

/**
 * @desc    Get all F1 employees with visa status records
 * @route   GET /api/hr/visa/all
 * @access  HR only
 */
export const getAllVisaStatuses = async (req, res) => {
  try {
    const allVisaData = await VisaStatus.find({
      'workAuthorization.type': 'F1', // Only F1 visa holders
    })
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .lean();

    res.status(200).json(allVisaData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all visa statuses', error: err.message });
  }
};

export const getVisaStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const visa = await VisaStatus.findById(id)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .lean();

    if (!visa) return res.status(404).json({ message: 'Visa status not found' });

    res.status(200).json(visa);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching visa status', error: err.message });
  }
};

/**
 * @desc    Approve an uploaded visa document
 * @route   PATCH /api/hr/visa/:id/approve
 * @access  HR only
 */
export const approveVisaDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    const visa = await VisaStatus.findById(id);
    if (!visa || !visa[documentType]) {
      return res.status(400).json({ message: 'Invalid visa document type' });
    }

    visa[documentType].status = 'Approved';
    visa[documentType].feedback = '';
    await visa.save();

    res.status(200).json({ message: `${documentType} approved` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve document', error: err.message });
  }
};

/**
 * @desc    Reject a visa document with feedback
 * @route   PATCH /api/hr/visa/:id/reject
 * @access  HR only
 */
export const rejectVisaDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, feedback } = req.body;

    const visa = await VisaStatus.findById(id);
    if (!visa || !visa[documentType]) {
      return res.status(400).json({ message: 'Invalid visa document type' });
    }

    visa[documentType].status = 'Rejected';
    visa[documentType].feedback = feedback;
    await visa.save();

    res.status(200).json({ message: `${documentType} rejected with feedback` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject document', error: err.message });
  }
};

/**
 * @desc    Notify employee for next steps via email
 * @route   POST /api/hr/visa/:id/notify
 * @access  HR only
 */
export const notifyEmployeeForNextStep = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await VisaStatus.findById(id)
      .populate({
        path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .lean();

    const email = visa?.employeeId?.userId?.email;
    if (!visa || !email) {
      return res.status(404).json({ message: 'Employee email not found' });
    }

    await sendVisaReminderEmail(email, visa);
    res.status(200).json({ message: 'Reminder email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reminder', error: err.message });
  }
};
