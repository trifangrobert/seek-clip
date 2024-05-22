const Comment = require("../models/commentModel");
const User = require("../models/authModel");
const Video = require("../models/videoModel");

import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";

const addComment = async (req: AuthRequest, res: Response) => {
    console.log("req.body: ", req.body)
  const { videoId, content } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("videoId: ", videoId);
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    let parentId = null; // top-level comment
    if (req.body.parentId) {
      parentId = req.body.parentId; // reply to a comment
    }

    const comment = new Comment({
      videoId,
      userId,
      content,
      parentId,
    });
    await comment.save();
    
    // populate the userId field in the comment object
    const populatedComment = await Comment.findById(comment._id).populate("userId", "username profilePicture firstName lastName email _id");
    return res.status(201).json(populatedComment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req: AuthRequest, res: Response) => {
  const { commentId, content } = req.body;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }

    comment.content = content;
    await comment.save();
    
    // populate the userId field in the comment object
    const populatedComment = await Comment
        .findById(comment._id)
        .populate("userId", "username profilePicture firstName lastName email _id");
    return res.status(200).json(populatedComment);

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req: AuthRequest, res: Response) => {
  const { commentId } = req.body;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(204).json("Comment deleted successfully");
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getCommentsForVideo = async (req: Request, res: Response) => {
    const { videoId } = req.params;
    
    try {
        const comments = await Comment.find({ videoId }).populate("userId", "username profilePicture firstName lastName email _id");
        return res.status(200).json(comments);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export { addComment, updateComment, deleteComment, getCommentsForVideo };
