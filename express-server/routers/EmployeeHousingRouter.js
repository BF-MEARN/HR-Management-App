import express from 'express';

import {
  autoAssignHousing,
  getCurrentEmployeeHouse,
} from '../controllers/EmployeeHousingController.js';
import { addResidentToHousing } from '../controllers/EmployeeOnboardingController.js';
import { requireEmployee, userAuth } from '../middlewares/AuthMiddlewares.js';

const router = express.Router();

/**
 * @desc    Auto-assign a new employee into an available house
 * @route   POST /api/employee/housing/autoAssignHousing
 */
router.post('/autoAssignHousing', autoAssignHousing, addResidentToHousing);

/**
 * @desc    Get the house that the current user is living in as an employee
 * @route   GET /api/employee/housing/getHouse
 */
router.get('/getHouse', getCurrentEmployeeHouse);

export default router;
