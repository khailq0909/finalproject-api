import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import emailRoute from "./routes/email.js"
import bookingsRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from 'http';

const app = express();
dotenv.config();
const connect = async () => {
try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to mongoDB.");
} catch (error) {
    throw error;
}
};

mongoose.connection.on("disconnected", () => {
console.log("mongoDB disconnected!");
});


//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/emails", emailRoute);

app.use((err, req, res, next) => {
const errorStatus = err.status || 500;
const errorMessage = err.message || "Something went wrong!";
return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
});
});


//adding socket.io configuration
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});
// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle socket events here
    socket.on('send_message',(data)=>{
        socket.emit("receive_message",data)   
    })
});

server.listen(3001, () => {
connect();
console.log("Connected to backend.");
});