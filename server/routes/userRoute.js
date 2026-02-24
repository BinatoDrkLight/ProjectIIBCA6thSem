import express from 'express'
import { googleUrl, isAuth, login, logout, otpVerification, redirectOauth, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/otp-verification', otpVerification)
userRouter.get('/google-url', googleUrl)
userRouter.get('/oauth2callback', redirectOauth)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

export default userRouter