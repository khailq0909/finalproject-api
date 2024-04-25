import express from 'express';
import {createBooking,getAllBookingByUserId,getAllBookingByHomeOnwerId,updateBooking,deleteBooking,cancelBooking, getBookings} from '../controllers/bookingController.js'
import {verifyToken,verifyHomeOwner, verifyAdmin} from '../utils/verifytoken.js';
const router = express.Router();

//CREATE
router.post("/",verifyToken, createBooking);
//UPDATE
router.put("/:id",verifyToken, updateBooking);
//Delete
router.delete("/:id",verifyToken, deleteBooking);
//Get All
router.get("/",verifyToken,getBookings );

//GET ALL BY USER ID
router.get("/by-user",verifyToken,getAllBookingByUserId );
//GET ALL BOOKING BY HOME OWNER ID
router.get("/by-homeowner",verifyToken,verifyHomeOwner,getAllBookingByHomeOnwerId);
// router.put('/addlike/post/:id', verifyToken, addLike);
// router.put('/removelike/post/:id', verifyToken, removeLike);
router.put("/cancle/:bookingId",verifyToken, cancelBooking);



export default router;