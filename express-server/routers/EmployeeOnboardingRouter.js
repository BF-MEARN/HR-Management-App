import { Router } from 'express';

import {
  addResidentToHousing,
  createHousing,
  createNewEmployee,
  getEmployeeData,
  getVisaStatus,
  updateVisaStatus,
  validateRegistrationToken,
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
employeeOnboardingRouter.patch('/update-visa', updateVisaStatus);
employeeOnboardingRouter.get('/registration-token/:tokenUUID', validateRegistrationToken);

export default employeeOnboardingRouter;
