import express from "express";
import {register, login, logout,sendCode,checkOTPCode,changePassword,checkPassWord} from '../controllers/authController.js';
import { verifyToken } from "../utils/verifytoken.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/sendcode', sendCode)
router.post('/checkOtp', checkOTPCode)
router.post('/changePassword', changePassword)
router.post('/checkPassword',verifyToken, checkPassWord)



export default router;
