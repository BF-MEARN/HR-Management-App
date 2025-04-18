import { Router } from 'express'
import { login, logout } from '../controllers/UserControllers.js'

const userRouter = Router();

userRouter.post('/login', login)
userRouter.post('/logout', logout)

export default userRouter