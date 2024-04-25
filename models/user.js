import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
{
    email: { type: String, required: true, unique: true },
    username: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true},
    lastname : { type: String, required: true },
    img: { type: String },
    phone: { type: Number, required: true },
    balance:{type: Number},
    requestHomeOwner:{type:Boolean, default: false},
    companyname: { type: String},
    bussinessCode:{type:String},
    identificationCard:{type:String},
    companytimeRegister:{type: String},
    cardImg: [{ type: String }],
    fileName: [{ type: String }],
    isAdmin: { type: Boolean, default:false },
    isHomeOwner: { type: Boolean, default: false },
    emailToken:{type: String},
    isVerified: { type: Boolean, default: false},
    otpToken:{type: Number},
    isActive:{type: Boolean, default: true}
},{ timestamps: true }
);

export default mongoose.model("User", UserSchema);