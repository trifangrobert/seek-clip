import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

interface Props {
  conversations: { id: string; title: string }[];
  selectConversation: (id: string) => void;
}

const SideConversations: React.FC<Props> = ({ conversations, selectConversation }) => {
  return (
    <List>
      {conversations.map((conversation) => (
        <ListItem
          button
          onClick={() => selectConversation(conversation.id)}
          key={conversation.id}
        >
          <ListItemText primary={conversation.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default SideConversations;
