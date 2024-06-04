import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { askGpt } from "../services/QAService";
import { CircularProgress } from "@mui/material";

interface QAModalProps {
  open: boolean;
  onClose: () => void;
  subtitles: string;
}

const QAModal: React.FC<QAModalProps> = ({ open, onClose, subtitles }) => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bottomListRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const handleSendQuestion = async () => {
    if (!question) return;
    setConversation((prev) => [...prev, `Q: ${question}`]);
    try {
      setLoading(true);
      const answer = await askGpt(question, subtitles);
      setConversation((prev) => [...prev, `A: ${answer}`]);
      setQuestion("");
    } catch (error) {
      console.error("Failed to fetch answer:", error);
      setConversation((prev) => [...prev, `A: Error: Failed to fetch answer`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ask a Question About This Video</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Your Question"
          type="text"
          fullWidth
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendQuestion()}
        />
        <Box sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
          {conversation.map((line, index) => (
            <Typography key={index} paragraph ref={index === conversation.length - 1 ? bottomListRef : null}>
              {line}
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        {!loading ? (
          <Button onClick={handleSendQuestion} disabled={loading}>
            Send
          </Button>
        ) : (
          <CircularProgress size={24} sx={{ ml: 2, mr: 2 }} />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QAModal;
