import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;
const roomSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true}],
  pricePerNight: { type: Number, required: true },
  imageUrls: [{ type: String, required: true }],
  fileName: [{ type: String, required: true }],
  lastUpdated: { type: Date },
  comments: [
    {
      rating: { type: Number, min: 0, max: 5 },
      comment: { type: String },
      created: { type: Date, default: Date.now },
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
      postedByUser: { type: String },
    },
  ],
  rating: { type: Number },
  numComments: { type: Number, default: 0 },
  currentBooking: [
    {
      bookingId: { type: ObjectId, ref: "Booking" },
      startDate: { type: Date},
      endDate: { type: Date },
      booker: { type: String },
      roomId: {type: mongoose.Schema.Types.ObjectId, ref: "Room" },
      status: {
        type: String,
      },
    },
  ],
});

export default mongoose.model("Room", roomSchema);
