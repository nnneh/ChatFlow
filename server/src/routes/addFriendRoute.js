import express from "express";
import mongoose from "mongoose";
import verifyLogin from "../middleware/authMiddleware.js";
import { IndividualChat } from "../models/individualChatModel.js";
import { AddFriend as AddFriendModel } from "../models/addFriendModel.js";
import User from "../models/userModel.js";

const friendRequestRouter = express.Router();
friendRequestRouter.use(verifyLogin);

// ── Helper: get sender ID safely from req ──
const getSenderId = (req) => {
  // ✅ Expanded fallback chain to safely capture IDs across various auth middleware setups
  const id = req.userID ?? req.userId ?? req.user?._id ?? req.user?.id ?? req.user?.userId;
  return id ? id.toString() : null;
};

// 1. Send Friend Request
// 1. Send Friend Request
friendRequestRouter.post("/sendRequest/:username", async (req, res) => {
  try {
    const targetUsername = req.params.username;

    if (!targetUsername) {
      return res.status(400).json({ message: "Username parameter is required" });
    }

    const targetUser = await User.findOne({
      username: { $regex: new RegExp(`^${targetUsername}$`, "i") },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const receiverId = targetUser._id.toString();
    const senderId = getSenderId(req);

    if (!senderId) {
      console.error("❌ Auth Debug: senderId resolved to null.");
      return res.status(401).json({ message: "Unauthorized: could not identify sender from token" });
    }

    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ message: "Invalid user ID tracking format" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const existingRequest = await AddFriendModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(409).json({ message: "Request already sent or users are already connected" });
    }

    // ✅ FIXED: Explicitly set status to 'pending' on creation to guarantee matching the query below
    const newRequestDoc = await AddFriendModel.create({ 
      sender: senderId, 
      receiver: receiverId,
      status: "pending" 
    });

    // Populate the newly created document directly instead of running a broad .find()
    const populatedRequest = await AddFriendModel.findById(newRequestDoc._id).populate({
      path: "sender",
      select: "-password -refreshToken"
    });

    // Structure formatting for real-time notification sockets
    const formattedData = {
      requestId: populatedRequest._id,
      sender: {
        _id: populatedRequest.sender._id,
        username: populatedRequest.sender.username,
        email: populatedRequest.sender.email,
        online: populatedRequest.sender.isOnline || false,
        avatar: populatedRequest.sender.avatar,
      },
      receiver: populatedRequest.receiver.toString(),
    };

    const io = req.app.get("io");
    if (io) {
      // It's cleaner to emit the single object instead of a wrapped array shell
      io.emit("new-friend-request", formattedData);
    }

    return res.status(201).json({ message: "Request Sent Successfully" });
  } catch (error) {
    console.error("Error in sendRequest:", error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// 2. Accept Friend Request
friendRequestRouter.post("/acceptRequest/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const currentUserId = getSenderId(req);

    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid Request Identifier" });
    }

    const friendRequestDoc = await AddFriendModel.findById(requestId).populate("sender receiver");

    if (!friendRequestDoc) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    if (friendRequestDoc.receiver._id.toString() !== currentUserId) {
      return res.status(401).json({ message: "Unauthorized Request Action" });
    }

    friendRequestDoc.status = "accepted";
    await friendRequestDoc.save();

    // Check if chat already exists before creating
    const existingChat = await IndividualChat.findOne({
      participants: { $all: [friendRequestDoc.sender._id, friendRequestDoc.receiver._id], $size: 2 },
    });

    const individualChat = existingChat ?? await IndividualChat.create({
      participants: [friendRequestDoc.sender._id, friendRequestDoc.receiver._id],
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new-friend", {
        chatId: individualChat._id,
        friend: friendRequestDoc.receiver,
        lastMessage: null,
        senderId: friendRequestDoc.sender._id.toString(),
      });
    }

    return res.status(200).json({ message: "Request Accepted Successfully. You Can Now Chat!" });
  } catch (error) {
    console.error("Error in acceptRequest:", error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// 3. Reject Friend Request
friendRequestRouter.post("/rejectRequest/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const currentUserId = getSenderId(req);

    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid Request Identifier" });
    }

    const friendRequestDoc = await AddFriendModel.findById(requestId);

    if (!friendRequestDoc) {
      return res.status(404).json({ message: "Request Not Found" });
    }

    const isAuthorized =
      friendRequestDoc.receiver.toString() === currentUserId ||
      friendRequestDoc.sender.toString() === currentUserId;

    if (!isAuthorized) {
      return res.status(401).json({ message: "Unauthorized Request Action" });
    }

    await friendRequestDoc.deleteOne();
    return res.status(200).json({ message: "Request Rejected Successfully" });
  } catch (error) {
    console.error("Error in rejectRequest:", error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// 4. Get All Pending Friend Requests
friendRequestRouter.get("/allrequest", async (req, res) => {
  try {
    const currentUserId = getSenderId(req);

    const requests = await AddFriendModel.find({
      receiver: currentUserId,
      status: "pending",
    }).populate({ path: "sender", select: "-password -refreshToken" });

    const formattedData = requests.map((f) => ({
      requestId: f._id,
      sender: {
        _id: f.sender._id,
        username: f.sender.username,
        email: f.sender.email,
        online: f.sender.isOnline || false,
        avatar: f.sender.avatar,
      },
    }));

    return res.status(200).json({ message: "All Friend Requests", request: formattedData });
  } catch (error) {
    console.error("Error in allrequest:", error);
    return res.status(500).json({ message: "Internal Server Failure" });
  }
});

export default friendRequestRouter;