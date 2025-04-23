import { Router } from 'express';

import {
  createHousing,
  createNewEmployee,
  validateRegistrationToken,
} from '../controllers/EmployeeOnboardingController.js';

const employeeOnboardingRouter = Router();

employeeOnboardingRouter.get('/registration-token/:tokenUUID', validateRegistrationToken);

employeeOnboardingRouter.post('/register', createNewEmployee);
employeeOnboardingRouter.post('/post-housing', createHousing);

export default employeeOnboardingRouter;
