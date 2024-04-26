import express from 'express';
import {
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    getAllHomeOwners,
} from '../controllers/userController.js';
import { verifyToken,verifyAdmin } from '../utils/verifytoken.js';
import User from "../models/user.js"
// 
const router = express.Router();
// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//     res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })

//UPDATE
router.put("/:id",verifyToken, updateUser);

//DELETE
router.delete("/:id", deleteUser,verifyToken,verifyAdmin);

//GET
router.get("/:id", getUser);

//GET ALL
router.get("/", getUsers,verifyToken,verifyAdmin);

router.get("/verify/:token", async(req,res)=>{
    try{
        const token = req.params.token;
        const user = await User.findOne({emailToken: token});
        if(user){
            user.emailToken = null;
            user.isVerified = true;
            await user.save();
            res.redirect("https://myhomestayz.netlify.app/login");
        }else{
            res.redirect("https://myhomestayz.netlify.app/register");
            res.status(400).send("email is not verified")
        }

    }catch(err){
        console.log(err)
    }
})

// router.get("listowner", getAllHomeOwners);

export default router;