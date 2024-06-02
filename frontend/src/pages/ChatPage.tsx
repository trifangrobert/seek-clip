import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import {
  Box,
  Button,
  Hidden,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { MessageType } from "../models/MessageType";
import { useTheme } from "../context/ThemeContext";

const ChatPage: React.FC = () => {
  const bottomListRef = useRef<null | HTMLLIElement>(null);
  const theme = useTheme();
  const { receiverId } = useParams<{ receiverId: string }>();
  const { user, token } = useAuthContext();
  const [messages, setMessages] = useState<MessageType[]>([]);
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

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !token) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/message/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(
            data.map((msg: MessageType) => ({
              ...msg,
              self: msg.senderId === user._id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, [receiverId, token, user]);

  if (!user || !token || !receiverId) {
    return <Loading />;
  }

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== "") {
      socket.emit("send-message", { receiverId, message: newMessage.trim() });
      setMessages((prev: MessageType[]) => [
        ...prev,
        {
          senderId: user._id,
          receiverId: receiverId,
          content: newMessage.trim(),
          self: true,
        },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Hidden smDown>
        <Box sx={{ width: 400, overflowY: "auto" }}>
          {/* Placeholder for other conversations list */}
          <List>{/* Map through other conversations and list them */}</List>
        </Box>
      </Hidden>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              ref={index === messages.length - 1 ? bottomListRef : null}
            >
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      display: "inline",
                      backgroundColor: msg.self ? "#e0f7fa" : "#fff9c4",
                      borderRadius: "10px",
                      padding: "5px 10px",
                      color: "black",
                    }}
                  >
                    {msg.content}
                  </Typography>
                }
                secondary={msg.self ? "You" : "Them"}
                sx={{ textAlign: msg.self ? "right" : "left" }}
              />
            </ListItem>
          ))}
        </List>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendMessage} color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;

/*
Show the profile pictures for both users:

- if the user is on the left side of the screen, show the profile picture to the left of the message

- if the user is on the right side, show the profile picture on the right side of the message
*/
