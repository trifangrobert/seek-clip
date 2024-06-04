import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
import jwt from "jsonwebtoken";

const userIdToSocketIdMap: Record<string, string> = {};

let io: SocketIOServer;

export const setupSocket = (server: http.Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // this is a middleware that checks JWT before allowing a connection
    io.use((socket, next) => {
        let token = socket.handshake.query.token as string;
        if (token?.startsWith('"') && token?.endsWith('"')) {
            token = token.slice(1, -1);
        }
        console.log("Socket token check", token);
        if (!token) {
            return next(new Error("Authentication error: Token not provided"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            socket.handshake.query.userId = (decoded as any)._id;
            next();
        } catch (error) {
            console.log("Socket authentication error:", error);
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        const userId = socket.handshake.query.userId as string;
        userIdToSocketIdMap[userId] = socket.id;
        console.log(`User with ID ${userId} connected with socket ID ${socket.id}`);

        console.log(`Checking for received messages while user was offline`);
        Message.find({ receiverId: userId, senderId: { $ne: userId }, delivered: false }).then((messages: any) => {
            messages.forEach((message: any) => {
                console.log(`Sending message to user with socket ID ${socket.id}`);
                socket.emit("new-message", message);
                message.delivered = true;
                message.save();
            });
        });

        socket.on("request-online-users", () => {
            console.log(`Request for online users: ${Object.keys(userIdToSocketIdMap)}`);
            socket.emit("online-users", Object.keys(userIdToSocketIdMap));
        });

        io.emit("online-users", Object.keys(userIdToSocketIdMap));

        socket.on("send-message", async ({receiverId, message}) => {
            console.log("Received message from client");
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

                let newMessage = new Message({
                    senderId: senderId,
                    receiverId: receiverId,
                    content: message,
                    delivered: false,
                });

                
                const receiverSocket = userIdToSocketIdMap[receiverId];
                console.log("receiverSocket: ", receiverSocket);

                if (receiverSocket) {
                    // console.log(`Message sent to receiver with socket ID ${receiverSocket}`);
                    newMessage.delivered = true;
                    // include the senderId, receiverId, and content in the message object
                    console.log(`Message sent from ${senderId} to ${receiverId}: ${message} on socket ID ${receiverSocket}`)
                    io.to(receiverSocket).emit("new-message", { senderId, receiverId, content: message });
                }
                else {
                    console.log("Receiver is offline, saving message to database");
                }
                conversation.messages.push(newMessage);
                await Promise.all([newMessage.save(), conversation.save()]);                


            } catch (error) {
                console.log("Error sending message: ", error);
            }

        });

        socket.on("disconnect", () => {
            console.log(`User with ID ${userId} disconnected`);
            delete userIdToSocketIdMap[userId];
            io.emit("online-users", Object.keys(userIdToSocketIdMap));
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