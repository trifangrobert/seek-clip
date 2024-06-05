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
import { getFollowers } from "../services/UserService";
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
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [sharedWith, setSharedWith] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !open) return;
    const fetchFollowers = async () => {
      const followers = await getFollowers(user.username);
      setFollowers(followers);
    };

    fetchFollowers();
  }, [open, user]);

  const handleShare = (follower: UserProfile) => {
    if (!sharedWith.has(follower._id)) {
      const message = `Check out this video: ${videoUrl}`;
      if (socket) {
        socket.emit("send-message", { receiverId: follower._id, message });
        console.log(`Message sent to ${follower._id}: ${message}`);
        setSharedWith(new Set(Array.from(sharedWith).concat(follower._id)));
      }
    }
  };

  const listStyle = {
    overflowY: "auto", // Enable vertical scrolling
    maxHeight: "250px", // Set a max height to activate scrolling
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
          {followers.map((follower) => (
            <ListItem
              key={follower._id}
              sx={{
                cursor: sharedWith.has(follower._id) ? "default" : "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: sharedWith.has(follower._id)
                    ? "inherit"
                    : theme.currentTheme === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
                },
                opacity: sharedWith.has(follower._id) ? 0.5 : 1,
              }}
              onClick={() =>
                !sharedWith.has(follower._id) && handleShare(follower)
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={`${process.env.REACT_APP_API_URL}/${follower.profilePicture}`}
                  alt={follower.username}
                />
              </ListItemAvatar>
              <ListItemText primary={follower.username} />
              {sharedWith.has(follower._id) && (
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
