import Booking from "../models/booking.js";
import Room from "../models/room.js";
import User from "../models/user.js";
import { createError } from "../utils/error.js";

export const createBooking = async (req, res, next) => {
  const { room, bookingby, checkin, checkout, totalday, totalcost } = req.body;
  const convertcheckInDay = new Date(new Date(checkin).getTime() + (7 * 60 * 60 * 1000))
  const convertcheckOutDay = new Date(new Date(checkout).getTime() + (7 * 60 * 60 * 1000))
  try {
    const code = generateRandomString(6);
    const newBooking = new Booking({
      room,
      homeOwnerId: room.userId,
      roomId:room._id,
      roomname:room.name,
      bookingby: bookingby._id,
      bookerInfo: bookingby.email,
      checkin: convertcheckInDay, 
      checkout: convertcheckOutDay, 
      totalday,
      totalcost,
      bookingcode:code.toLocaleUpperCase(),
    })
    const booking = await newBooking.save();
    const roomtemp = await Room.findOne({_id: booking.roomId})
    const currentBooking ={
      bookingId: booking._id,
      startDate: convertcheckInDay, 
      endDate: convertcheckOutDay,
      booker: booking.bookingby,
      roomId: booking.roomId,
      status: booking.bookingstatus,
    }
    roomtemp.currentBooking.push(currentBooking);
    await roomtemp.save();
    const user = await User.findOne({_id: room.userId})
    console.log(user)
    user.balance = (user.balance + booking.totalcost).toFixed(2)
    user.save();
    res.status(200).json({message: "created successfully", order: booking});
  } catch (err) {
    // console.log(err)
  }
};
//updateBooking
export const updateBooking = async (req, res, next) => {
  try {
    const updateBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateBooking);
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

//deletebooking
export const deleteBooking = async (req, res, next) => {
  try {
    try {
      await Booking.findByIdAndDelete(req.params.id);
      res.status(200).json("Booking has been deleted.");
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await User.find();
    res.status(200).json(bookings);
  } catch (err) {
    return next(err);
  }
};

export const getAllBookingByUserId = async (req, res, next) => {
  try {
    const userId = String(req.userId);
    const bookings = await Booking.find();
    const listBooking = [];
    bookings.map((b) => {
      if (String(b.bookingby) === userId) {
        console.log("book", b)
        console.log(userId)
        listBooking.push(b);
      }
    });
    res.status(200).json(listBooking);
  } catch (err) {
    return next(createError(err.status, err.message));
  }
};

export const getAllBookingByHomeOnwerId = async (req, res, next) => {
  try {
    const userId = String(req.userId);
    const bookings = await Booking.find();
    const listBooking = [];

    bookings.map((b) => {
      if (String(b.homeOwnerId) === userId) {
        listBooking.push(b);
      }
    });
    res.status(200).json(listBooking);
  } catch (err) {
    return next(createError(err.status, err.message));
  }
};
export const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    const roomId = booking.roomId;
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $pull: { "currentBooking": { "bookingId": bookingId } } },
      { new: true }
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { bookingstatus: 'Cancelled' } },
      { new: true }
    );
    const user = await User.findOne({_id: booking.homeOwnerId})
    console.log("booking", booking)
    user.balance = (user.balance - (booking.totalcost * 90)/100).toFixed(2)
    user.save();
    res.status(200).json({ updatedRoom, updatedBooking });
  } catch (err) {
    return next(createError(err.status, err.message));
  }
};

const generateRandomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

