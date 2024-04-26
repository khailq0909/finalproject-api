import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createError } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

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

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      emailToken: crypto.randomBytes(64).toString("hex"),
      password: hash,
    });
    await newUser.save();
    const mailOptions = {
      from: {
        name: "MyHomeStay.com",
        address: process.env.EMAIL_USER,
      },
      to: newUser.email,
      subject: "Verify your email",
      html: `<h2>${newUser.lastname}! Thanks for joining with MyHomeStay.com</h2>
      <h4>Please verify your email to continue...</h4>
      <a href="http://localhost:3001/api/users/verify/${newUser.emailToken}">Click here to verify</a>
      `,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Verifycation email is sent to your gmail account");
      }
    });

    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (user.isActive === false) {
      return next(createError(400, "Your account has been baned!"));
    }
    if (user.isVerified === false)
      return next(
        createError(
          400,
          "Your email is not verified. Please check your email !!!"
        )
      );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
        isHomeOwner: user.isHomeOwner,
      },
      process.env.JWT_SECRET_KEY
    );

    const {
      password,
      phone,
      birthday,
      city,
      createdAt,
      gender,
      updatedAt,
      ...otherDetails
    } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 31 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.cookie("access_token", "", {
    expires: new Date(0),
  });
  res.send();
};

export const sendCode = async (req, res) => {
  const email = req.body.email;
  const Otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { otpToken: Otp },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const mailOptions = {
      from: {
        name: "MyHomeStay.com",
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject: `Forgot Password code ${user.otpToken}`,
      html: `<h2>MyHomeStay.com Secret Verification code</h2>
      <p>Dear ${user?.lastname}</p>
      <p>This is your code to change your password</p>
      <p>Please never share this code for anyone. Thank you for using our services</p>
      `,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Verifycation code is sent to your gmail account");
      }
    });
    res
      .status(200)
      .json({ message: "Vertification code is sent to your gmail account" });
  } catch (err) {
    return next(createError(400, "Some thing went wrong"));
  }
};
export const checkOTPCode = async (req, res, next) => {
  const otp = req.body.otp;
  const user = await User.findOne({ otpToken: otp });
  if (user) {
    res.status(200).json({ message: "Otp code is valid" });
  } else {
    return next(createError(400, "OTP is not valid!"));
  }
};
export const checkPassWord = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  console.log(user)
  const currentPass = user?.password;
  const oldPass = req.body.oldPass;
  const newPass = req.body.newPass;
  const confirm = req.body.confirmPass;
  console.log(oldPass, newPass, confirm);
  try {
    if (newPass !== confirm) res.status(402).send({ message: "Confirm passwords do not match" });
    if (bcrypt.compare(currentPass, oldPass)) {
      let hashPassword = bcrypt.hashSync(newPass, salt);
      user.password = hashPassword;
      return res.status(200).send({ message: "Password changed" });
    } else {
      res.status(400).send({ message: "Passwords do not match" });
    }
  } catch {
    return next(createError(500, "something went wrong"));
  }
};

export const changePassword = async (req, res, next) => {
  const email = req.body.email;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const updateUser = {
    
    password: hash,
    otpToken: null,
  };
  try {
    await User.findOneAndUpdate({ email: email }, updateUser, { new: true });
    res.status(200).json({ message: "change password successfully" });
  } catch (err) {
    next(createError(400, "something went wrong"));
  }
};
