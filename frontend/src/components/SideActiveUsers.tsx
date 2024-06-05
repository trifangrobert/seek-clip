import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Badge,
  Typography,
  Divider,
  ListSubheader,
} from "@mui/material";
import { getUserById } from "../services/UserService";
import { useNavigate } from "react-router-dom";

interface Props {
  onlineFollowingIds: string[];
  offlineFollowingIds: string[];
  onlineNotFollowingIds: string[];
}

const SideActiveUsers: React.FC<Props> = ({
  onlineFollowingIds,
  offlineFollowingIds,
  onlineNotFollowingIds,
}) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [notFollowingUsers, setNotFollowingUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async (userIds: string[], online: boolean) => {
      try {
        const userDetails = await Promise.all(
          userIds.map((userId) => getUserById(userId))
        );

        return userDetails.map((user) => ({
          ...user,
          profilePicture: `${process.env.REACT_APP_API_URL}/${user.profilePicture}`,
          online,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        return [];
      }
    };

    const fetchUsers = async () => {
      const onlineFollowedDetails = await fetchUserDetails(
        onlineFollowingIds,
        true
      );
      const offlineFollowedDetails = await fetchUserDetails(
        offlineFollowingIds,
        false
      );
      const onlineNotFollowedDetails = await fetchUserDetails(
        onlineNotFollowingIds,
        true
      );

      setFollowingUsers([...onlineFollowedDetails, ...offlineFollowedDetails]);
      setNotFollowingUsers([...onlineNotFollowedDetails]);
    };

    fetchUsers();
  }, [onlineFollowingIds, offlineFollowingIds, onlineNotFollowingIds]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Users</Typography>
      <List subheader={<ListSubheader>Followed Users</ListSubheader>}>
        {followingUsers.map((user) => (
          <ListItem
            key={user._id}
            onClick={() => navigate(`/chat/${user._id}`, { replace: true })}
            button
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: user.online ? "green" : "grey",
                  }}
                />
              }
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
        <Divider />
        <ListSubheader>Others</ListSubheader>
        {notFollowingUsers.map((user) => (
          <ListItem
            key={user._id}
            onClick={() => navigate(`/chat/${user._id}`, { replace: true })}
            button
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "green", // Assuming all not-following users are online
                  }}
                />
              }
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
