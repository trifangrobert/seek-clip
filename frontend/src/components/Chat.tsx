import React, { useRef, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Avatar,
  ListItemAvatar,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MessageType } from "../models/MessageType";
import { UserProfile } from "../models/UserType";

interface Props {
  messages: MessageType[];
  sendMessage: (event: React.FormEvent, message: string) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  user: UserProfile;
  receiver: UserProfile;
}

const Chat: React.FC<Props> = ({
  messages,
  sendMessage,
  newMessage,
  setNewMessage,
  user,
  receiver,
}) => {
  const bottomListRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    sendMessage(e, newMessage.trim());
    setNewMessage("");
    inputRef.current?.focus();
  };

  const userProfilePicture = `${process.env.REACT_APP_API_URL}/${user.profilePicture}`;
  const receiverProfilePicture = `${process.env.REACT_APP_API_URL}/${receiver.profilePicture}`;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Avatar src={receiverProfilePicture} sx={{ marginRight: 2 }} />
          <Typography variant="h6" color="inherit">
            {receiver.firstName} {receiver.lastName}
          </Typography>
        </Toolbar>
      </AppBar>
      <List sx={{ overflowY: "auto", flexGrow: 1 }}>
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            alignItems="flex-start"
            ref={index === messages.length - 1 ? bottomListRef : null}
            sx={{
              flexDirection: msg.self ? "row-reverse" : "row",
              textAlign: msg.self ? "right" : "left",
            }}
          >
            <ListItemAvatar sx={{ marginLeft: msg.self ? 2 : 0 }}>
              <Avatar
                src={msg.self ? userProfilePicture : receiverProfilePicture}
              />
            </ListItemAvatar>
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
              secondary={msg.self ? user.firstName : receiver.firstName}
            />
          </ListItem>
        ))}
      </List>
      <Paper
        component="form"
        onSubmit={handleSendMessage}
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
          inputRef={inputRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" color="primary">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};

export default Chat;
