import express from 'express'
import connect from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/IndividualChatRoute.js'
import friendRequestRouter from './routes/addFriendRoute.js'
import groupRouter from './routes/groupRoutes.js'
import http from "http";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
dotenv.config()
const port = process.env.PORT
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


connect()
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()) 
app.use(cookieParser())

// Add this line to serve static files (uploaded images)
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

app.use(userRouter)
app.use(chatRouter)
app.use(friendRequestRouter)
app.use(groupRouter)


// app.listen(port, () => {
//   console.log(`ChatFlow app listening on port ${port}`)
// })

const onlineUsers = new Map();

io.on("connection", (socket) => {
    // console.log("A user connected with session ID:", socket.id);

    socket.on("login", (userId) => {
        console.log("User logged in: ", userId);
        
        onlineUsers.set(userId, socket.id);

        io.emit("user-online", userId);
    });

    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
        // console.log(`User ${socket.id} joined chat ${chatId}`);
    });


    socket.on("user-typing", (data) => {
        // socket.to() safely excludes the sender from receiving their own typing echo
        socket.to(data.chatId).emit("started-typing", data);
    });

    socket.on("logout", (userId) => {
        console.log("User logged out: ", userId);
        io.emit("user-offline", userId);
        onlineUsers.delete(userId);
    });

    socket.on("disconnect", () => {
        let disconnectedUserId = null;

        // Perform a quick reverse lookup loop to find who owned this socket pipe
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }

        // If found, clean up system memory and broadcast offline status
        if (disconnectedUserId) {
            console.log(`User disconnected automatically: ${disconnectedUserId}`);
            io.emit("user-offline", disconnectedUserId);
            onlineUsers.delete(disconnectedUserId);
        }
    });
});

app.set("io", io);

// app.post("/api/send-message", (req, res) => {
//     const activeIo = req.app.get("io");
//     const { chatId, senderId, text } = req.body;

//     // Inside a real route, you'd save to database here, then emit live:
//     // activeIo.to(chatId).emit("message-received", { senderId, text });

//     res.status(200).json({ success: true, message: "Message dispatched" });
// });

server.listen(port, () => {
    console.log(` Chat backend safely executing on port ${port}`);
});