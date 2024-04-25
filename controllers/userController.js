import User from "../models/user.js";
import { createError } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    return next(err);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

export const getAllHomeOwners = async (req, res, next) => {
  try {
    const userss = await User.find();
    // const homeOwners = users.filter(user => user.isHomeOwner === true);
    // // console.log(req)
    // console.log("homeOwners", homeOwners);
    res.status(200).json(userss);
  } catch (err) {
    return next(err);
  }
};
