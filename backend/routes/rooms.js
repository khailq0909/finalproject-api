import express from 'express';
import {createRoom,updateRoom,deleteRoom,getRoom,getAllRoom, getAllRoomByUserId, addComment, countByCity,countByType,searchSuggestions, getAllProvinceExit} from '../controllers/roomController.js'
import {verifyToken,verifyHomeOwner, verifyAdmin} from '../utils/verifytoken.js';
import uploadCloud from '../config/Cloudinary.config.js';
const router = express.Router();

//CREATE
router.post("/",uploadCloud.array('imageUrls'),verifyToken,verifyHomeOwner, createRoom);
//UPDATE
router.put("/:id",verifyToken,verifyHomeOwner, updateRoom);
//DELETE
router.delete("/:id",verifyToken,verifyHomeOwner, deleteRoom);
//GET BY ID
router.get("/find/:id", getRoom);
//GET ALL ROOM
router.get("/", getAllRoom);
router.get("/city/countbycity", countByCity);
router.get("/countByType", countByType);
//GET ALL ROOM BY USER ID
router.get("/list",verifyToken,verifyHomeOwner, getAllRoomByUserId);
router.put('/comment/room/:id', verifyToken, addComment);
router.get("/searchSuggestions", searchSuggestions);
router.get("/getProvince", getAllProvinceExit);

// router.put('/addlike/post/:id', verifyToken, addLike);
// router.put('/removelike/post/:id', verifyToken, removeLike);

export default router;