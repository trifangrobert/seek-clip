import React from 'react';
import { Modal, Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { UserProfile } from '../models/UserType';
import { useNavigate } from 'react-router-dom';


interface ProfileModalProps {
  modalType: "followers" | "following" | null;
  data: UserProfile[];
  onClose: () => void;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  overflow: "auto",
  maxHeight: "80vh",
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  modalType,
  data,
  onClose,
}) => {
    const navigate = useNavigate();
  if (!modalType) return null;

  const title = modalType === "followers" ? "Followers" : "Following";

  const handleUserClick = (userId: string) => {
    onClose();
    navigate(`/profile/${userId}`);
  }

  return (
    <Modal
      open={!!modalType}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <List>
          {data.map((person) => (
            <ListItem key={person._id} onClick={() => handleUserClick(person.username)} sx={{ cursor: "pointer" }}>
              <ListItemAvatar>
                <Avatar
                  src={`${process.env.REACT_APP_API_URL}/${person.profilePicture}`}
                  alt={person.username}
                />
              </ListItemAvatar>
              <ListItemText
                primary={person.username}
                secondary={`${person.firstName} ${person.lastName}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
