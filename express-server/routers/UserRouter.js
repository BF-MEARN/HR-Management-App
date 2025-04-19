import { Router } from 'express';

import { login, logout, register } from '../controllers/UserControllers.js';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/register', register);

export default userRouter;
