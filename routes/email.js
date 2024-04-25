import express from "express";
import nodemailer from "nodemailer";
import createError from "http-errors";
import { verifyToken } from "../utils/verifytoken.js";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/sendEmail", verifyToken,  (req, res, next) => {
  try {
    const { email, subject, html } = req.body;
    const mailOptions = {
      from: {
        name: "MyHomeStay.com",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: subject,
      html: html,
    };
     transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.log("Error sending email:", err);
console.log(err)
  }
});

export default router;
