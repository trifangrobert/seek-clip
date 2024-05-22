import axios from "axios";
import { CommentType } from "../models/CommentType";

const commentApi = process.env.REACT_APP_API_URL + "/api/comment";

export const addCommentAPI = async (
  videoId: string,
  content: string,
  parentId: string | null = null
) => {
  const token = localStorage.getItem("token");
  const response = await axios.post<CommentType>(
    commentApi + "/add",
    {
      videoId,
      content,
      parentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteCommentAPI = async (commentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete<CommentType>(
    commentApi + "/delete",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        commentId,
      },
    }
    
  );
  return response.data;
};

export const updateCommentAPI = async (commentId: string, content: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.put<CommentType>(
    commentApi + "/update",
    {
      commentId,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getCommentsForVideo = async (videoId: string) => {
  const response = await axios.get<CommentType[]>(
    commentApi + "/video/" + videoId
  );
  return response.data;
};
