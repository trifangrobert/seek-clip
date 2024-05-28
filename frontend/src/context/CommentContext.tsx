import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getCommentsForVideo, addCommentAPI, updateCommentAPI, deleteCommentAPI } from "../services/CommentService";
import { CommentType } from "../models/CommentType";

type Action =
  | { type: "SET_COMMENTS"; payload: CommentType[] }
  | {
      type: "ADD_REPLY";
      payload: { parentId: string; newComment: CommentType };
    }
  | { type: "ADD_COMMENT"; payload: CommentType }
  | { type: "UPDATE_COMMENT"; payload: { commentId: string; content: string } }; 

type State = CommentType[];

interface CommentContextType {
  comments: State;
  addReply: (content: string, parentId: string) => Promise<void>;
  addTopComment: (content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

const commentsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_COMMENTS":
      return buildCommentTree(action.payload);
    case "ADD_COMMENT":
      // add a top level comment
      return [...state, { ...action.payload, replies: [] }];
    case "UPDATE_COMMENT":
      // update a comment
      return state.map((comment) => {
        if (comment._id === action.payload.commentId) {
          return { ...comment, content: action.payload.content };
        }
        return comment;
      });
    default:
      return state;
  }
};

const buildCommentTree = (comments: CommentType[]) => {
  let commentMap: { [key: string]: CommentType } = {};
  let commentTree: CommentType[] = [];
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment._id] = comment;
  });
  comments.forEach((comment) => {
    if (comment.parentId) {
      commentMap[comment.parentId].replies.push(comment);
    } else {
      commentTree.push(comment);
    }
  });

  // each list of replies should be sorted by date
  commentTree.forEach((comment) => {
    comment.replies.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  });

  // sort top level comments by date
  return commentTree.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return commentTree;
};

export const CommentProvider: React.FC<{
  children: React.ReactNode;
  videoId: string;
}> = ({ children, videoId }) => {
  const [comments, dispatch] = useReducer(commentsReducer, []);

  useEffect(() => {
    async function fetchComments() {
      const fetchedComments = await getCommentsForVideo(videoId);
      dispatch({ type: "SET_COMMENTS", payload: fetchedComments });
    }
    fetchComments();
  }, [videoId]);

  const addReply = async (content: string, parentId: string): Promise<void> => {
    await addCommentAPI(videoId, content, parentId);
    const fetchedComments = await getCommentsForVideo(videoId);
    dispatch({ type: "SET_COMMENTS", payload: fetchedComments });
  };

  const addTopComment = async (content: string): Promise<void> => {
    const newComment = await addCommentAPI(videoId, content);
    dispatch({ type: "ADD_COMMENT", payload: newComment });
  };

  const updateComment = async (commentId: string, content: string) => {
    await updateCommentAPI(commentId, content);
    const fetchedComments = await getCommentsForVideo(videoId);
    dispatch({ type: "SET_COMMENTS", payload: fetchedComments });
  }
    
  const deleteComment = async (commentId: string) => {
    await deleteCommentAPI(commentId);
    const fetchedComments = await getCommentsForVideo(videoId);
    dispatch({ type: "SET_COMMENTS", payload: fetchedComments });
  }

  return (
    <CommentContext.Provider value={{ comments, addReply, addTopComment, updateComment, deleteComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
