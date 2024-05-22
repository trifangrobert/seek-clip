import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  videoId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  parentId?: Schema.Types.ObjectId;
  isDeleted: boolean;
}

const commentSchema = new Schema(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: "comments", timestamps: true }
);


const Comment = mongoose.model<IComment>("Comment", commentSchema);

module.exports = Comment;