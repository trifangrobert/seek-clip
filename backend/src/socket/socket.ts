import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

const userIdToSocketIdMap: Record<string, string> = {};

let io: SocketIOServer;

export const setupSocket = (server: http.Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        const userId = socket.handshake.query.userId as string;
        userIdToSocketIdMap[userId] = socket.id;
        console.log(`User with ID ${userId} connected with socket ID ${socket.id}`);

        io.emit("onlineUsers", Object.keys(userIdToSocketIdMap));

        socket.on("send-message", async ({receiverId, message}) => {
            const senderId = socket.handshake.query.userId as string;
            console.log("senderId: ", senderId);
            console.log("receiverId: ", receiverId);
            console.log("message: ", message);

            if (!senderId || !receiverId || !message) {
                return;
            }

            try {
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

                conversation.messages.push(newMessage);

                await Promise.all([newMessage.save(), conversation.save()]);

                const receiverSocket = userIdToSocketIdMap[receiverId];
                console.log("receiverSocket: ", receiverSocket);
                if (receiverSocket) {
                    console.log(
                        `Sending message to receiver with socket ID ${receiverSocket}`
                    );
                    io.to(receiverSocket).emit("new-message", newMessage);
                }


            } catch (error) {
                console.log("Error sending message: ", error);
            }

        });

        socket.on("disconnect", () => {
            console.log(`User with ID ${userId} disconnected`);
            delete userIdToSocketIdMap[userId];
            io.emit("onlineUsers", Object.keys(userIdToSocketIdMap));
        });
    });

    return io;
}

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

export const getSocketForUser = (userId: string) => {
    return userIdToSocketIdMap[userId];
}