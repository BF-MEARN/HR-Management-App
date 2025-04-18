// const { Router } = require('express');
// const UserController = require('../controllers/UserControllers.cjs');
// const authMiddleware = require('../middleware/authMiddleware.cjs');
import {login, logout} from '../controllers/UserControllers.js'
import {Router} from 'express'

const userRouter = Router();

userRouter.post('/login', login)
userRouter.post('/logout', logout)

export default userRouter