import React, { useState } from "react";
import { Box, Typography, Avatar, Stack, Button, TextField, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommentType } from "../models/CommentType";
import { useComments } from "../context/CommentContext";
import { useAuthContext } from "../context/AuthContext";


interface CommentProps {
  comment: CommentType;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  const { addReply, updateComment, deleteComment } = useComments();
  const { user } = useAuthContext();
  const [replying, setReplying] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [editContent, setEditContent] = useState<string>(comment.content);

  const handleReply = async () => {
    if (replyContent.trim()) {
      await addReply(replyContent, comment._id);
      setReplyContent("");
      setReplying(false);
    }
  };

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      await updateComment(comment._id, editContent);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    await deleteComment(comment._id);
  };

  const cancelEdit = () => {
    setEditContent(comment.content);
    setEditing(false);
  };

  const isOwner = user?._id === comment.userId._id;
  console.log("comment: ", comment);
  console.log("user: ", user);
  console.log("comment.userId._id: ", comment.userId._id)
  console.log("user.userId: ", user?._id)
  console.log("isOwner: ", isOwner);

  return (
    <Box sx={{ marginLeft: `${depth * 20}px`, marginTop: "10px", paddingLeft: "10px", borderLeft: depth > 0 ? "2px solid #ccc" : "none" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
          src={process.env.REACT_APP_API_URL + "/" + comment.userId.profilePicture}
          sx={{ width: 30, height: 30 }}
        />
        <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          {comment.userId.firstName} {comment.userId.lastName}
        </Typography>
        {!comment.isDeleted && isOwner && !editing && (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton>
            <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
          </Stack>
        )}
      </Stack>
      {!comment.isDeleted && editing ? (
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          />
          <Button size="small" onClick={handleEdit} disabled={!editContent.trim()}>Save</Button>
          <Button size="small" onClick={cancelEdit}>Cancel</Button>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ ml: 4 }}>{comment.content}</Typography>
      )}
      <Button size="small" onClick={() => setReplying(!replying)}>Reply</Button>
      {replying && (
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
          />
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" onClick={() => setReplying(false)}>Cancel</Button>
            <Button size="small" onClick={handleReply} disabled={!replyContent.trim()}>Reply</Button>
          </Box>
        </Box>
      )}
      {comment.replies && comment.replies.map((reply: CommentType) => (
        <Comment key={reply._id} comment={reply} depth={depth + 1} />
      ))}
    </Box>
  );
};

export default Comment;
