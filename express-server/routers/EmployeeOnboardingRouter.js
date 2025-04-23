import { Router } from 'express';

import {
  addResidentToHousing,
  createHousing,
  createNewEmployee,
  getEmployeeData,
  getVisaStatus,
  updateI20,
  updateI983,
  updateOptEAD,
  updateOptReceipt,
  validateRegistrationToken
} from '../controllers/EmployeeOnboardingController.js';

const employeeOnboardingRouter = Router();

/**
 * @desc    Create new employee in DB
 * @route   GET /api/onboarding/register
 */
employeeOnboardingRouter.post('/register', createNewEmployee);

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
employeeOnboardingRouter.get('/registration-token/:tokenUUID', validateRegistrationToken);

export default employeeOnboardingRouter;
