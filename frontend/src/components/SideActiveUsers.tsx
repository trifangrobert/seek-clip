import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Avatar, Box, Badge, Typography } from "@mui/material";
import { getUserById } from "../services/UserService";
import { useNavigate } from "react-router-dom";

interface Props {
  activeUserIds: string[];
  offlineFollowedIds: string[];
}

const SideActiveUsers: React.FC<Props> = ({ activeUserIds, offlineFollowedIds }) => {
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async (userIds: string[]) => {
      try {
        const userDetails = await Promise.all(
          userIds.map(userId => getUserById(userId))
        );

        return userDetails.map(user => ({
          _id: user._id,
          username: user.username,
          profilePicture: `${process.env.REACT_APP_API_URL}/${user.profilePicture}`,
          firstName: user.firstName,
          lastName: user.lastName,
          online: activeUserIds.includes(user._id)
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        return [];
      }
    };

    const fetchUsers = async () => {
      const activeUsersDetails = await fetchUserDetails(activeUserIds);
      const offlineUsersDetails = await fetchUserDetails(offlineFollowedIds);

      console.log("Triggered fetchUsers");

      setUsers([...activeUsersDetails, ...offlineUsersDetails]);
    };

    fetchUsers();
  }, [activeUserIds, offlineFollowedIds]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Active Users</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id} onClick={() => navigate(`/chat/${user._id}`, { replace: true })} button>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={<Box sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: user.online ? 'green' : 'grey'
              }} />}
            >
              <Avatar
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.username}
                sx={{ marginRight: 2 }}
              />
            </Badge>
            <ListItemText primary={user.firstName + " " + user.lastName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideActiveUsers;
