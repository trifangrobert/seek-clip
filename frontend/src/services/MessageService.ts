import { MessageType } from "../models/MessageType";

const messageAPI = process.env.REACT_APP_API_URL + "/api/message";

export const getMessages = async (
  receiverId: string,
  token: string
): Promise<MessageType[]> => {
  try {
    const response = await fetch(`${messageAPI}/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error fetching messages");
    }
    const messages: MessageType[] = await response.json();
    return messages;
  } catch (error) {
    console.log("Error fetching messages: ", error);
    throw error;
  }
};
