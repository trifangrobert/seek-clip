import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { UserProfile } from "../models/UserType";
import { getFollowing } from "../services/UserService";
import { useTheme } from "../context/ThemeContext";
import CheckIcon from "@mui/icons-material/Check";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, videoUrl }) => {
  const theme = useTheme();
  const { user, socket } = useAuthContext();
  const [followings, setFollowings] = useState<UserProfile[]>([]);
  const [sharedWith, setSharedWith] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !open) return;
    const fetchFollowing = async () => {
      const followers = await getFollowing(user.username);
      setFollowings(followers);
    };

    fetchFollowing();
  }, [open, user]);

  const handleShare = (following: UserProfile) => {
    if (!sharedWith.has(following._id)) {
      const message = `Check out this video: ${videoUrl}`;
      if (socket) {
        socket.emit("send-message", { receiverId: following._id, message });
        // console.log(`Message sent to ${following._id}: ${message}`);
        setSharedWith(new Set(Array.from(sharedWith).concat(following._id)));
      }
    }
  };

  const listStyle = {
    overflowY: "auto",
    maxHeight: "250px", 
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 5px grey",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      borderRadius: "10px",
    },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Share Video
        </Typography>
        <List sx={listStyle}>
          {followings.map((following) => (
            <ListItem
              key={following._id}
              sx={{
                cursor: sharedWith.has(following._id) ? "default" : "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: sharedWith.has(following._id)
                    ? "inherit"
                    : theme.currentTheme === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
                },
                opacity: sharedWith.has(following._id) ? 0.5 : 1,
              }}
              onClick={() =>
                !sharedWith.has(following._id) && handleShare(following)
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={`${process.env.REACT_APP_API_URL}/${following.profilePicture}`}
                  alt={following.username}
                />
              </ListItemAvatar>
              <ListItemText primary={following.username} />
              {sharedWith.has(following._id) && (
                <CheckIcon color="success" sx={{ ml: 2 }} />
              )}
            </ListItem>
          ))}
        </List>
        <Box textAlign="center" mt={2} sx={{ p: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareModal;
