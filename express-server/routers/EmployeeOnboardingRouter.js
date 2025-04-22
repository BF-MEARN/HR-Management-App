import { Router } from 'express';

import { createNewEmployee, createHousing } from '../controllers/EmployeeOnboardingController.js';

const employeeOnboardingRouter = Router();

employeeOnboardingRouter.post('/register', createNewEmployee);
employeeOnboardingRouter.post('/post-housing', createHousing);

export default employeeOnboardingRouter;
