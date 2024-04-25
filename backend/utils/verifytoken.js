import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};
// export const verifyUser = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, "You are not authorized!"));
//     }
//   });
// };
export const verifyHomeOwner = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing access token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.isHomeOwner = decoded.isHomeOwner;
    req.isAdmin = decoded.isAdmin;

    // Check if the user is a homeowner or an admin
    if (req.isHomeOwner === true || req.isAdmin === true) {
      next(); // User is authorized, proceed to the next middleware
    } else {
      return res.status(401).json({ message: "Unauthorized: You dont have permission" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid access token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing access token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.isAdmin = decoded.isAdmin;
    // Check if the user is an admin
    if (req.isAdmin === true) {
      next(); // User is authorized, proceed to the next middleware
    } else {
      return res.status(401).json({ message: "Unauthorized: You dont have permission" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid access token" });
  }
};
