import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Hidden } from "@mui/material";
import SideConversations from "../components/SideConversations";
import Chat from "../components/Chat";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { MessageType } from "../models/MessageType";
import { getMessages } from "../services/MessageService";
import { getUserById } from "../services/UserService";
import { UserProfile } from "../models/UserType";

const ChatPage: React.FC = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  const { user, token } = useAuthContext();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [receiverDetails, setReceiverDetails] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const newSocket = io(backendUrl, {
      query: { userId: user._id },
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("new-message", (message: any) => {
      if (message.senderId === receiverId) {
        setMessages((prev: MessageType[]) => [...prev, message]);
      }
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [user, token]);

  useEffect(() => {
    if (!user || !token || !receiverId) return;
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(receiverId, token);
        setMessages(
          fetchedMessages.map((msg: MessageType) => ({
            ...msg,
            self: msg.senderId === user._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    const fetchReceiverDetails = async () => {
      try {
        const fetchedReceiver = await getUserById(receiverId);
        setReceiverDetails(fetchedReceiver);
      } catch (error) {
        console.error("Error fetching receiver details: ", error);
      }
    }

    fetchMessages();
    fetchReceiverDetails();
  }, [receiverId, token, user]);

  // Placeholder for fetching other conversations
  useEffect(() => {
    // Simulate fetching conversations
    setConversations([
      { id: "123", title: "User 123" },
      { id: "234", title: "User 234" },
    ]); // Example conversation
  }, []);

  if (!user || !token || !receiverId || !receiverDetails || !socket) {
    return <Loading />;
  }

  const sendMessage = (event: React.FormEvent, content: string) => {
    event.preventDefault();
    if (socket && content.trim() !== "") {
      socket.emit("send-message", { receiverId, message: content.trim() });
      setMessages((prev: MessageType[]) => [
        ...prev,
        {
          senderId: user._id,
          receiverId: receiverId,
          content: content.trim(),
          self: true,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "90vh", overflow: "hidden" }}>
      <Hidden smDown>
        <Box sx={{ width: "25%", overflowY: "auto" }}>
          <SideConversations
            conversations={conversations}
            selectConversation={(id) =>
              console.log("Selected conversation ID:", id)
            }
          />
        </Box>
      </Hidden>
      <Chat
        messages={messages}
        sendMessage={sendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        user={user}
        receiver={receiverDetails}
      />
    </Box>
  );
};

export default ChatPage;
