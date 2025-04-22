import { Router } from 'express';

import { login, logout, register, verifyUser } from '../controllers/UserControllers.js';
import { userAuth } from '../middlewares/AuthMiddlewares.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

router.get('/me', userAuth, verifyUser);

export default router;
