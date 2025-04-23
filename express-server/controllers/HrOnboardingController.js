import Employee from '../models/Employee.js';
// eslint-disable-next-line no-unused-vars
import User from '../models/User.js';
// eslint-disable-next-line no-unused-vars
import VisaStatus from '../models/VisaStatus.js';

/**
 * @desc    Get all pending onboarding applications
 * @route   GET /api/hr/onboarding/pending
 * @access  HR only
 */
export const getPendingApplications = async (req, res) => {
  try {
    const pendingApps = await Employee.find({ onboardingStatus: 'Pending' })
      .populate('userId', 'email role')
      .populate('visaInfo');

    res.status(200).json(pendingApps);
  } catch (error) {
    console.error('Error fetching pending onboarding applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error });
  }
};

/**
 * @desc    Get all approved onboarding applications
 * @route   GET /api/hr/onboarding/approved
 * @access  HR only
 */
export const getApprovedApplications = async (req, res) => {
  try {
    const approvedApps = await Employee.find({ onboardingStatus: 'Approved' })
      .populate('userId', 'email role')
      .populate('visaInfo');

    res.status(200).json(approvedApps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved applications', error });
  }
};

/**
 * @desc    Get all rejected onboarding applications
 * @route   GET /api/hr/onboarding/rejected
 * @access  HR only
 */
export const getRejectedApplications = async (req, res) => {
  try {
    const rejectedApps = await Employee.find({ onboardingStatus: 'Rejected' })
      .populate('userId', 'email role')
      .populate('visaInfo');

    res.status(200).json(rejectedApps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rejected applications', error });
  }
};

/**
 * @desc    Get full application form by employee ID
 * @route   GET /api/hr/onboarding/:id
 * @access  HR only
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Employee.findById(id)
      .populate('userId', 'email role')
      .populate('visaInfo');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch application', error });
  }
};

/**
 * @desc    Approve onboarding application
 * @route   POST /api/hr/onboarding/:id/approve
 * @access  HR only
 */
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { onboardingStatus: 'Approved' },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Application approved', employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve application', error });
  }
};

/**
 * @desc    Reject onboarding application with feedback
 * @route   POST /api/hr/onboarding/:id/reject
 * @access  HR only
 */
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        onboardingStatus: 'Rejected',
        onboardingFeedback: feedback || '',
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Application rejected', employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject application', error });
  }
};
