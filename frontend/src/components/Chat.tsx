import React, { useRef, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { MessageType } from '../models/MessageType';

interface Props {
    messages: MessageType[];
    sendMessage: (event: React.FormEvent, message: string) => void;
    newMessage: string;
    setNewMessage: (message: string) => void;
}

const Chat: React.FC<Props> = ({ messages, sendMessage, newMessage, setNewMessage }) => {
  const bottomListRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    sendMessage(e, newMessage.trim());
    setNewMessage('');
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} alignItems="flex-start" ref={index === messages.length - 1 ? bottomListRef : null}>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    display: 'inline',
                    backgroundColor: msg.self ? '#e0f7fa' : '#fff9c4',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    color: 'black',
                  }}
                >
                  {msg.content}
                </Typography>
              }
              secondary={msg.self ? 'You' : 'Them'}
              sx={{ textAlign: msg.self ? 'right' : 'left' }}
            />
          </ListItem>
        ))}
      </List>
      <Paper component="form" onSubmit={(e) => handleSendMessage(e)} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}>
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
