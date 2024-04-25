import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    homeOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    room:{
      type: Object,
      required: true
    },
    roomId: {
      type: String,
      required: [true, "Room id is required field"],
    },
    roomname: {
      type: String,
    },
    bookingby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required field"],
    },
    bookerInfo:{type:String,required: [true, "User id is required field"]},
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    totalday: { type: Number, required: true },
    totalcost: { type: Number, required: true },
    bookingstatus: {
      type: String,
      default: "Completed",
      enum: ["Cancelled", "Completed"],
      required: [true, "Room status is required field."],
    },
    bookingcode: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
