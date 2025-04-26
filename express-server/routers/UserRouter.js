import { Router } from 'express';

import {
  hrLogout,
  login,
  logout,
  register,
  validateRegistrationToken,
  verifyUser,
} from '../controllers/UserControllers.js';
import { employeeAuth, hrAuth } from '../middlewares/AuthMiddlewares.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/hrLogout', hrAuth, hrLogout);
router.post('/register', register);
router.get('/register/:tokenUUID', validateRegistrationToken);

router.get('/me', employeeAuth, verifyUser); // employee-only
router.get('/hr/me', hrAuth, verifyUser); // HR-only

export default router;
