import express from "express";
import mongoose from "mongoose";
import verifyLogin from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadFileMiddleware.js";
import { Message } from "../models/messageModel.js";
import { IndividualChat } from "../models/individualChatModel.js";
import User from "../models/userModel.js";
import { AddFriend } from "../models/addFriendModel.js";

const chatRouter = express.Router();

// Apply auth middleware to all individual chat routes
chatRouter.use(verifyLogin);

// Get or Create Chat Room
chatRouter.post("/chat", async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!mongoose.isValidObjectId(partnerId)) {
      return res.status(400).json({ message: "Invalid Partner ID" });
    }

    if (partnerId === req.userID) {
      return res.status(400).json({ message: "You Cannot Chat With Yourself" });
    }

    // Find chat where both users are in the participants array
    let chat = await IndividualChat.findOne({
      participants: { $all: [req.userID, partnerId] },
    });

    if (chat) {
      return res.status(200).json({ message: "Chat Retrieved", chat });
    }

    // Create a fresh chat room if none exists
    chat = await IndividualChat.create({
      participants: [req.userID, partnerId],
      messages: [],
    });

    return res.status(201).json({ message: "Chat Created Successfully", chat });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// Get My Messages (Simplified)
chatRouter.get("/myMessages/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chatId,
      chatType: "IndividualChat",
    }).populate("sender");

    if (messages.length === 0) {
      return res.status(404).json({ message: "No Messages Found" });
    }

    const formattedMessages = messages.map(({ sender, content, createdAt }) => ({
      sender: sender._id.toString() === req.userID ? "You" : sender.username,
      senderId: sender._id,
      avatar: sender.avatar,
      content,
      createdAt,
    }));

    return res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// Send Message (No Files, Just Text)
chatRouter.post("/message/:chatId", upload.array("file"), async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ message: "Invalid Chat ID" });
    }

    const chat = await IndividualChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Verify user belongs in this chat
    if (!chat.participants.includes(req.userID)) {
      return res.status(401).json({ message: "You Are Not Authorized In This Chat" });
    }

    const senderUser = await User.findById(req.userID);

    // Save basic text message to database
    const message = await Message.create({
      sender: req.userID,
      content,
      chatId,
      chatType: "IndividualChat",
    });

    const formattedMessage = {
      sender: senderUser.username,
      senderId: senderUser._id,
      avatar: senderUser.avatar,
      content: message.content,
      createdAt: message.createdAt,
      chatId: chatId,
    };

    // Broadcast message via socket room
    const io = req.app.get("io");
    io.to(chatId).emit("receive-message", formattedMessage);

    return res.status(200).json({
      message: "Message Sent Successfully",
      sendMessage: formattedMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

// Disconnect Friend (Basic Cleanup)
chatRouter.delete("/remove/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ message: "Invalid Chat ID" });
    }

    const chat = await IndividualChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    if (!chat.participants.includes(req.userID)) {
      return res.status(401).json({ message: "You Are Not In This Chat" });
    }

    const userIds = chat.participants.map((id) => id.toString());
    
    // Clean up related friend requests, the chat record, and related text logs
    await AddFriend.deleteOne({ 
      $or: [
        { sender: userIds[0], receiver: userIds[1] }, 
        { sender: userIds[1], receiver: userIds[0] }
      ] 
    });

    await chat.deleteOne();
    await Message.deleteMany({ chatId });

    // Broadcast update
    const io = req.app.get("io");
    io.emit("unfriend", chatId);

    return res.status(200).json({ message: "Friend Disconnected Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Failure" });
  }
});

export default chatRouter;