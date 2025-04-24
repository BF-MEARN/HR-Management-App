import { Router } from 'express';

import {
  acceptEmployeeOnboardingSubmission,
  addResidentToHousing,
  createHousing,
  getEmployeeData,
  getVisaStatus,
  updateI20,
  updateI983,
  updateOptEAD,
  updateOptReceipt,
} from '../controllers/EmployeeOnboardingController.js';

const employeeOnboardingRouter = Router();

/**
 * @desc    Submit a new employee application in DB
 * @route   GET /api/onboarding/register
 */
employeeOnboardingRouter.post('/', acceptEmployeeOnboardingSubmission);

/**
 * NOT USE in onboarding!
 */

/**
 * @desc    Create new housing in DB
 * @route   GET /api/onboarding/register
 */
employeeOnboardingRouter.post('/post-housing', createHousing);
employeeOnboardingRouter.post('/add-resident-to-housing', addResidentToHousing);
employeeOnboardingRouter.get('/employee-data', getEmployeeData);
employeeOnboardingRouter.get('/visa-status', getVisaStatus);
employeeOnboardingRouter.patch('/update-opt-receipt', updateOptReceipt);
employeeOnboardingRouter.patch('/update-opt-ead', updateOptEAD);
employeeOnboardingRouter.patch('/update-i983', updateI983);
employeeOnboardingRouter.patch('/update-i20', updateI20);

export default employeeOnboardingRouter;
