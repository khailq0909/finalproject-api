import express from "express";
import {register, login, logout,sendCode,checkOTPCode,changePassword} from '../controllers/authController.js';


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/sendcode', sendCode)
router.post('/checkOtp', checkOTPCode)
router.post('/changePassword', changePassword)


export default router;
