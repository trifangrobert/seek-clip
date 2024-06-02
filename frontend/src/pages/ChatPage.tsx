// components/ChatPage.tsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";

const ChatPage: React.FC = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  const { user, token } = useAuthContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!user || !token) return;
    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const newSocket = io(backendUrl, {
      query: { userId: user._id },
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("new-message", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [user, token]);

  const sendMessage = () => {
    if (socket && user) {
      socket.emit("send-message", { receiverId, message: newMessage });
      setMessages((prev) => [
        ...prev,
        { senderId: user._id, content: newMessage },
      ]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !token) return;
      try {
        console.log(`Fetching messages for user ${user._id}`);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/message/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response: ", res);
        if (res.ok) {
          const data = await res.json();
          console.log("Data: ", data);
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, [receiverId, token]);

  if (!user || !token) {
    return <Loading />;
  }

  return (
    <div>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.content}
              secondary={msg.senderId === user._id ? "You" : "Them"}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
      />
      <Button onClick={sendMessage} color="primary" variant="contained">
        Send
      </Button>
    </div>
  );
};

export default ChatPage;
