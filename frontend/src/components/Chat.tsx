import React, { useRef, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MessageType } from "../models/MessageType";
import { UserProfile } from "../models/UserType";
import { useNavigate } from "react-router-dom";
import linkifyHtml from "linkify-html";

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
  const navigate = useNavigate();
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

  const handleContentClick = (event: React.MouseEvent) => {
    event.preventDefault();

    const target = event.target as any;
    if (target.tagName === "A" && target.href) {
      const absoluteUrl = new URL(target.href);
      console.log("absoluteUrl: ", absoluteUrl)
      if (absoluteUrl.origin === window.location.origin) {
        navigate(absoluteUrl.pathname, { replace: true });
      }
      else {
        window.open(target.href, "_blank");
      }
    }
  }

  const userProfilePicture = `${process.env.REACT_APP_API_URL}/${user.profilePicture}`;
  const receiverProfilePicture = `${process.env.REACT_APP_API_URL}/${receiver.profilePicture}`;

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <AppBar
        position="static"
        color="default"
        onClick={() =>
          navigate(`/profile/${receiver.username}`, { replace: true })
        }
        sx={{ cursor: "pointer" }}
      >
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
              justifyContent: msg.self ? "flex-end" : "flex-start", 
              width: "100%", 
              marginBottom: "10px", 
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: msg.self ? "row-reverse" : "row", 
                alignItems: "center",
              }}
            >
              <Avatar
                src={msg.self ? userProfilePicture : receiverProfilePicture}
                sx={{ mx: 1 }} 
              />
              <Box
                sx={{
                  backgroundColor: msg.self ? "#e0f7fa" : "#fff9c4",
                  borderRadius: "15px",
                  padding: "10px 15px",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                }}
                onClick={handleContentClick}
              >
                {/* <Typography variant="body2" color="black"> */}
                {/* {msg.content} */}
                {/* </Typography> */}
                <Typography
                  variant="body2"
                  color="black"
                  dangerouslySetInnerHTML={{
                    __html: linkifyHtml(msg.content, {
                      defaultProtocol: "https",
                    }),
                  }}
                  sx={{
                    wordBreak: 'break-word', 
                    cursor: 'pointer',
                    maxWidth: '100%',
                  }}
                ></Typography>
              </Box>
            </Box>
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
