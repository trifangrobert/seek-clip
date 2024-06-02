const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { getIo, getSocketForUser } from "../socket/socket";

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.userId;

  console.log("senderId: ", senderId);
  console.log("receiverId: ", receiverId);
  console.log("message: ", message);

  try {
    const io = getIo();

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      content: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    const receiverSocket = getSocketForUser(receiverId);
    console.log("receiverSocket: ", receiverSocket);
    if (receiverSocket) {
      console.log(
        `Sending message to receiver with socket ID ${receiverSocket}`
      );
      io.to(receiverSocket).emit("new-message", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error sending message: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const { id: receiverId } = req.params;
  const senderId = req.userId;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error getting messages: ", error);
    res.status(500).json({ error: "Server error" });
  }
};
