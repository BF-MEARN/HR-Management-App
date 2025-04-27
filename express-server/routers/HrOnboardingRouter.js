import express from 'express';

import {
  approveAndAssignHousing,
  approveApplication,
  getApplicationById,
  getApprovedApplications,
  getPendingApplications,
  getRejectedApplications,
  rejectApplication,
} from '../controllers/HrOnboardingController.js';

const router = express.Router();

/**
 * @desc    Get all pending applications
 * @route   GET /api/hr/onboarding/pending
 */
router.get('/pending', getPendingApplications);

/**
 * @desc    Get all approved applications
 * @route   GET /api/hr/onboarding/approved
 */
router.get('/approved', getApprovedApplications);

/**
 * @desc    Get all rejected applications
 * @route   GET /api/hr/onboarding/rejected
 */
router.get('/rejected', getRejectedApplications);

/**
 * @desc    View full application form
 * @route   GET /api/hr/onboarding/:id
 */
router.get('/:id', getApplicationById);

/**
 * @desc    Approve an application
 * @route   POST /api/hr/onboarding/:id/approve
 */
router.post('/:id/approve', approveApplication);

/**
 * @desc    Reject an application (with feedback)
 * @route   POST /api/hr/onboarding/:id/reject
 */
router.post('/:id/reject', rejectApplication);

router.patch('/approve-and-assign/:id', approveAndAssignHousing);
export default router;
