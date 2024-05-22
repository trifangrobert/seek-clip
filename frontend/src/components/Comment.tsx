import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { CommentType } from "../models/CommentType";
import { useState } from "react";
import { useComments } from "../context/CommentContext";

interface CommentProps {
  comment: CommentType;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  const [replying, setReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const { addReply } = useComments();

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await addReply(replyContent, comment._id);
    setReplyContent("");
    setReplying(false);
  };

  const cancelReply = () => {
    setReplying(false);
    setReplyContent("");
  }

  return (
    <Box
      sx={{
        marginLeft: `${depth * 20}px`,
        marginTop: "10px",
        paddingLeft: "10px",
        borderLeft: depth > 0 ? "2px solid #ccc" : "none", // Highlight thread lines
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
          src={
            process.env.REACT_APP_API_URL + "/" + comment.userId.profilePicture
          }
          sx={{ width: 30, height: 30 }} // Small avatar for comments
        />
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {comment.userId.firstName} {comment.userId.lastName}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {comment.content}
      </Typography>
      <Button size="small"  onClick={() => setReplying(!replying)}>
        Reply
      </Button>
      {replying && (
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            sx={{ mb: 1 }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" onClick={cancelReply} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button size="small" onClick={handleReply} disabled={!replyContent.trim()}>
              Reply
            </Button>
          </Box>
        </Box>
      )}
      {comment.replies &&
        comment.replies.map((reply: CommentType) => (
          <Comment
            key={reply._id}
            comment={reply}
            depth={depth + 1}
          />
        ))}
    </Box>
  );
};

export default Comment;
