import Room from "../models/room.js";
import User from "../models/user.js";
import Booking from "../models/booking.js";
import { createError } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";

export const createRoom = async (req, res, next) => {
  const newRoom = new Room(req.body);
  newRoom.lastUpdated = new Date();
  newRoom.userId = req.userId;
  try {
    const saveRoom = await newRoom.save();
    res.status(200).json(saveRoom);
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};
export const getAllProvinceExit= async (req, res, next) => {
  try{

    const rooms = await Room.find();
    const listCity = [];
    rooms.map((room) => {
        const city = room.city;
        listCity.push(city);
      });
    res.status(200).json([...new Set(listCity)])
  }catch{
    res.status(400).json({message: "Something went wrong"})
  }
}
export const getAllRoom = async (req, res, next) => {
  const { min, max, city, startDate, endDate } = req.query;
  try {
    const page = parseInt(req.query.page) -1||0;
    const limit = parseInt(req.query.limit) || 3;
    let type = req.query.type || "All";
    let fac = req.query.fac || "All";
    let sort = req.query.sort || "pricePerNight"
  req.query.sort? (sort = req.query.sort.split(',')): (sort = [sort]);
  let sortBy = {}
  if(sort[1]){
    sortBy[sort[0]] = sort[1]
  }else{
    sortBy[sort[0]] = "asc"
  }
    const typeOptions = ["Home", "Apartments", "Resorts", "Villas", "Cabin"];
    const facilityOptions = [
      "Free WiFi",
      "Parking",
      "Airport Shuttle",
      "Family Rooms",
      "Non-Smoking Rooms",
      "Outdoor Pool",
      "Spa",
      "Fitness Center",
      "Laundry",
      "Pet Friendly",
      "Luggage Storage",
      "Free breakfast",
      "Room service",
    ];
    type === "All" ? type = [...typeOptions] : type = req.query.type ;
    fac === "All" ? fac = [...facilityOptions] : fac = req.query.fac.split(',');
    const bookings = await Booking.find({
      bookingstatus: "Completed",
      $or: [
        { checkin: { $gte: startDate, $lte: endDate } },
        { checkout: { $gte: startDate, $lte: endDate } },
        { $and: [{ start: { $lte: startDate } }, { end: { $gte: endDate } }] },
      ],
    }).select("roomId");
    const roomIds = bookings.map((b) => b.roomId);
    const rooms = await Room.find({
      _id: { $nin: roomIds },
      pricePerNight: { $gt: min | 0, $lt: max || 999 },
      city: { $regex: new RegExp(city, "i") },
      type: { $in: type },
      facilities: {$in: [...fac]}
    }).sort(sortBy)
    const total = await Room.countDocuments({
      facilities: {$in:[...fac]}, 
      pricePerNight: { $gt: min | 0, $lt: max || 999 },
      city: {$regex: new RegExp(city, "i")},
      type: { $in: type },
    })
    const respone = {
      error: "false",
      total,
      page: page +1,
      limit,
      rooms
    }
    res.status(200).json(respone)
  } catch (err) {
    next(createError(err));
  }
};

export const searchSuggestions = async (req, res) => {
  const searchTerm = req.query.term;
  console.log(searchTerm)
  try {
    const items = await Room.find({ name: { $regex: new RegExp(searchTerm, "i") }}).limit(10); // Modify the query to include the city
    const names = items.map((item) => ({ name: item.name })); // Map items to include both name and city
    const suggestions = [...names];
    console.log("sug",suggestions)
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateRoom);
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    const imageFilenames = room.fileName;
    imageFilenames.map((filename) => {
      cloudinary.uploader.destroy(filename, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
    });
    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ message: "Room has been deleted" });
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

export const getAllRoomByUserId = async (req, res, next) => {
  try {
    const userId = String(req.userId);
    const rooms = await Room.find();
    const listRoom = [];
    rooms.map((room) => {
      if (room.userId === userId) {
        listRoom.push(room);
      }
    });
    res.status(200).json(listRoom);
    console.log(listRoom);
  } catch (err) {
    return next(createError("500", "Something went wrong"));
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.city.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Room.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const homeCount = await Room.countDocuments({ type: "Home" });
    const apartmentCount = await Room.countDocuments({ type: "Apartment" });
    const resortCount = await Room.countDocuments({ type: "Resort" });
    const villaCount = await Room.countDocuments({ type: "Villa" });
    const cabinCount = await Room.countDocuments({ type: "Cabin" });

    res.status(200).json([
      { type: "Home", count: homeCount },
      { type: "Apartments", count: apartmentCount },
      { type: "Resorts", count: resortCount },
      { type: "Villas", count: villaCount },
      { type: "Cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  const { rating, comment } = req.body;

  const userId = String(req.userId);
  const user = await User.findById(userId);
  const room = await Room.findById(req.params.id);
  if (room) {
    const alreadyComment = room.comments.find(
      (room) => room.postedBy.toString() === req.userId.toString()
    );
    if (!alreadyComment) {
      const review = {
        rating: Number(rating),
        comment: String(comment),
        postedBy: userId,
        postedByUser: user.username,
      };
      room.comments.push(review);
      room.numComments = room.comments.length;

      room.rating = Math.round(
        room.comments.reduce(
          (acc, item) => Number(item.rating) + Number(acc),
          0
        ) / room.comments.length
      );
      await room.save();
      const post = await Room.findById(room).populate(
        "comments.postedBy",
        "name email"
      );
      res.status(200).json({ success: true, message: "Review Added", post });
    } else {
      next(createError(400, "You are already feedback"));
    }
  } else {
    res.status(404);
    next("Product not found");
  }
};
