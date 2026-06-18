import express from "express";
import verifyLogin from "../middleware/authMiddleware.js";
import { IndividualChat } from "../models/individualChatModel.js";

const friendRouter = express.Router();
friendRouter.use(verifyLogin);

const getSenderId = (req) => {
  const id = req.userID ?? req.userId ?? req.user?._id ?? req.user?.id ?? req.user?.userId;
  return id ? id.toString() : null;
};

friendRouter.get("/", async (req, res) => {
  try {
    const currentUserId = getSenderId(req);

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chats = await IndividualChat.find({
      participants: currentUserId,
    }).populate({
      path: "participants",
      select: "-password -refreshToken",
    });

    const friends = chats.map((chat) => {
      const friend = chat.participants.find(
        (p) => p._id.toString() !== currentUserId
      );
      if (!friend) return null;
      return {
        _id: friend._id,
        username: friend.username,
        email: friend.email,
        avatar: friend.avatar || null,
        online: friend.isOnline || false,
        chatId: chat._id,
      };
    }).filter(Boolean); // remove any nulls

    return res.status(200).json({ Friends: friends });
  } catch (error) {
    console.error("Error in GET /friend:", error);
    return res.status(500).json({ message: "Internal Server Failure" });
  }
});

export default friendRouter;