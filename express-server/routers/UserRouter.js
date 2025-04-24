import { Router } from 'express';

import {
  login,
  logout,
  register,
  validateRegistrationToken,
  verifyUser,
} from '../controllers/UserControllers.js';
import { userAuth } from '../middlewares/AuthMiddlewares.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register); //consider use a separated employee register
router.get('/register/:tokenUUID', validateRegistrationToken);

router.get('/me', userAuth, verifyUser);

export default router;
