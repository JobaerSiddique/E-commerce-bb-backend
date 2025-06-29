import express from 'express'
import { AuthController } from './auth.controller';


const router = express.Router();


router.post('/login',AuthController.UserLogin)
router.post('/forget-password',AuthController.forgetPassword)
router.post('/reset-password',AuthController.resetPassword)
router.post('/refreshToken',AuthController.refreshToken)


export const AuthRoute= router;