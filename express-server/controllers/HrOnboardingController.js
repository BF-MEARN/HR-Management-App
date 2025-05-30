/* eslint-disable no-unused-vars */
import Employee from '../models/Employee.js';
import Housing from '../models/Housing.js';
import User from '../models/User.js';
import VisaStatus from '../models/VisaStatus.js';
import { autoAssignHousing } from './EmployeeHousingController.js';
import { addResidentToHousing } from './EmployeeOnboardingController.js';

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

    // Auto-approve OPT Receipt if applicable
    const visa = await VisaStatus.findOne({ employeeId: employee._id });

    if (
      visa &&
      visa.workAuthorization.type === 'F1' &&
      visa.optReceipt &&
      visa.optReceipt.status === 'Pending Approval'
    ) {
      visa.optReceipt.status = 'Approved';
      visa.optReceipt.feedback = '';
      await visa.save();
      console.log(`[Auto-Approve] OPT Receipt approved for F1 employee ${employee._id}`);
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

/**
 * @desc    Approve application and assign housing to employee
 * @route   PATCH /api/hr/onboarding/approve-and-assign/:id
 * @access  HR only
 */
export const approveAndAssignHousing = async (req, res) => {
  try {
    const { id } = req.params; // Employee ID

    // 1. Update onboarding status to 'Approved'
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.onboardingStatus === 'Approved') {
      return res.status(400).json({ message: 'Employee is already approved' });
    }

    // 2. Update the employee status
    employee.onboardingStatus = 'Approved';

    // 3. If feedback is provided in the request
    if (req.body.feedback) {
      employee.onboardingFeedback = req.body.feedback;
    }

    // Save employee first to update status
    await employee.save();

    // 4. Auto-assign to a house with fewest residents
    const houses = await Housing.find().populate('residents');

    if (houses.length === 0) {
      return res.status(404).json({ message: 'No housing available for assignment' });
    }

    // Find house with fewest residents
    let leastPopulatedHouse = houses.reduce((prev, current) =>
      prev.residents.length <= current.residents.length ? prev : current
    );

    // 5. Add employee to house using existing logic from addResidentToHousing
    const address = leastPopulatedHouse.address;

    // Update employee with house information
    employee.houseId = leastPopulatedHouse._id;
    employee.address = {
      ...employee.address,
      building: leastPopulatedHouse.address.building,
      street: leastPopulatedHouse.address.street,
      city: leastPopulatedHouse.address.city,
      state: leastPopulatedHouse.address.state,
      zip: leastPopulatedHouse.address.zip,
    };

    await employee.save();

    // Update house residents array
    if (!leastPopulatedHouse.residents.includes(id)) {
      leastPopulatedHouse.residents.push(id);
      await leastPopulatedHouse.save();
    }

    return res.status(200).json({
      message: 'Application approved and housing assigned successfully',
      houseId: leastPopulatedHouse._id,
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return res.status(500).json({
      message: 'Failed to approve application and assign housing',
      error: error.message,
    });
  }
};
