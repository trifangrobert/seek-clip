import React, { useEffect, useState, useContext } from "react";
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

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, videoUrl }) => {
  const theme = useTheme();
  const { user, socket } = useAuthContext();
  const [followers, setFollowers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!user || !open) return;
    const fetchFollowers = async () => {
      const followers = await getFollowers(user.username);
      setFollowers(followers);
    };

    fetchFollowers();
  }, [open, user]);

  const handleShare = (follower: UserProfile) => {
    const message = `Check out this video: ${videoUrl}`;
    if (socket) {
      socket.emit("send-message", { receiverId: follower._id, message });
      console.log(`Message sent to ${follower._id}: ${message}`);
    }
    onClose();
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 4, overflowY: "auto", flexGrow: 1 }}>
          <Typography variant="h6" component="h2">
            Share Video
          </Typography>
          <List>
            {followers.map((follower) => (
              <ListItem
                onClick={() => handleShare(follower)}
                key={follower._id}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.currentTheme === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`${process.env.REACT_APP_API_URL}/${follower.profilePicture}`}
                    alt={follower.username}
                  />
                </ListItemAvatar>
                <ListItemText primary={follower.username} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box textAlign="center" mt={2} sx={{ p: 2 }}>
          {" "}
          {/* Footer Box */}
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareModal;
