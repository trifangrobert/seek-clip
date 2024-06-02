import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Hidden, Typography } from "@mui/material";
import SideActiveUsers from "../components/SideActiveUsers";
import Chat from "../components/Chat";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { MessageType } from "../models/MessageType";
import { getMessages } from "../services/MessageService";
import { getFollowing, getUserById } from "../services/UserService";
import { UserProfile } from "../models/UserType";
import { useTheme } from "../context/ThemeContext";

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const { receiverId } = useParams<{ receiverId: string }>();
  const { user, token, socket } = useAuthContext();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [receiverDetails, setReceiverDetails] = useState<UserProfile | null>(
    null
  );
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!user || !token || !socket) return;

    socket.emit("request-online-users");

    socket.on("new-message", (message: any) => {
      if (message.senderId === receiverId) {
        setMessages((prev: MessageType[]) => [...prev, message]);
      }
    });

    socket.on("online-users", (onlineUsers: string[]) => {
      console.log("Online users: ", onlineUsers);
      setActiveUsers(onlineUsers);
    });

    return () => {
      socket.off("new-message");
      socket.off("online-users");
    };
  }, [user, token, socket]);

  useEffect(() => {
    if (!user || !token) return;
    const fetchMessages = async () => {
      try {
        if (!receiverId) return;
        const fetchedMessages = await getMessages(receiverId, token);
        if (!fetchedMessages) throw new Error("No messages found");
        setMessages(
          fetchedMessages.map((msg: MessageType) => ({
            ...msg,
            self: msg.senderId === user._id,
          }))
        );
        setError(null);
      } catch (error) {
        // console.error("Error fetching messages: ", error);
        setError("Could not fetch messages!");
        setMessages([]);
      }
    };

    const fetchReceiverDetails = async () => {
      try {
        if (!receiverId) return;
        const fetchedReceiver = await getUserById(receiverId);
        if (!fetchedReceiver) throw new Error("Receiver not found");
        setReceiverDetails(fetchedReceiver);
        setError(null);
      } catch (error) {
        // console.error("Error fetching receiver details: ", error);
        setError("Could not find user!");
        setReceiverDetails(null);
      }
    };

    const fetchFollowing = async () => {
      try {
        const fetchedFollowing = await getFollowing(user.username);
        setFollowing(fetchedFollowing);
      } catch (error) {
        console.error("Error fetching following: ", error);
      }
    };

    fetchMessages();
    fetchReceiverDetails();
    fetchFollowing();
  }, [receiverId, token, user]);

  // extract the ids of users that the current user is following but are offline
  const offlineFollowed = useMemo(() => {
    return following
      .filter((f) => !activeUsers.includes(f._id))
      .map((f) => f._id);
  }, [following, activeUsers]);

  if (!user || !token || !socket) {
    return <Loading />;
  }

  const sendMessage = (event: React.FormEvent, content: string) => {
    event.preventDefault();
    if (socket && content.trim() !== "" && receiverId) {
      socket.emit("send-message", { receiverId, message: content.trim() });
      setMessages((prev: MessageType[]) => [
        ...prev,
        {
          senderId: user._id,
          receiverId: receiverId,
          content: content.trim(),
          self: true,
        },
      ]);
      setNewMessage("");
    }
  };

  const borderColor = theme.currentTheme === 'dark' ? "#424242" : "#e0e0e0";

  return (
    <Box sx={{ display: "flex", height: "90vh", overflow: "hidden" }}>
      <Hidden smDown>
        <Box sx={{ width: "25%", overflowY: "auto", borderRight: `1px solid ${borderColor}` }}>
          <SideActiveUsers
            activeUserIds={activeUsers}
            offlineFollowedIds={offlineFollowed}
          />
        </Box>
      </Hidden>
      {error ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "error.main",
            }}
          >
            {error}
          </Typography>
        </Box>
      ) : receiverId && receiverDetails ? (
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          user={user}
          receiver={receiverDetails}
        />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "medium",
              color: "primary.main",
            }}
          >
            👋 Hey there! Select a conversation and start chatting. 🚀
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
