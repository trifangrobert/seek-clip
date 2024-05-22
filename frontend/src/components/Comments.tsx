import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import Comment from "./Comment";
import { useComments } from "../context/CommentContext";
import { useAuthContext } from "../context/AuthContext";
import DefaultProfilePicture from "../assets/default-profile-picture.png";

export const Comments: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { comments, addTopComment } = useComments();
  const { user } = useAuthContext();
  const [newComment, setNewComment] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const handleAddTopLevelComment = async () => {
    if (newComment.trim()) {
      await addTopComment(newComment);
      setNewComment("");  
    }
  };

  const handleCancel = () => {
    setNewComment("");  
    setShowButtons(false);
  };

  const handleFocus = () => {
    setShowButtons(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (inputAreaRef.current && !inputAreaRef.current.contains(document.activeElement)) {
        setShowButtons(false);
        setNewComment(""); 
      }
    }, 0);
  };

  const userAvatarUrl = user?.profilePicture 
    ? `${process.env.REACT_APP_API_URL}/${user.profilePicture}`
    : DefaultProfilePicture;

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Typography variant="h6">Comments</Typography>
      <Box 
        ref={inputAreaRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{ display: 'flex', alignItems: 'flex-end', mt: 2 }}
      >
        <Avatar src={userAvatarUrl} sx={{ width: 40, height: 40, mr: 1 }} />
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Add a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2} 
          sx={{ flexGrow: 1, mr: 1 }}
        />
        {showButtons && (
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{ height: '40px', mr: 1 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              sx={{ height: '40px' }}
              onClick={handleAddTopLevelComment}
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </Box>
        )}
      </Box>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Box>
  );
};
