import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  videoId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  parentId?: Schema.Types.ObjectId;
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
  },
  { collection: "comments", timestamps: true }
);


const Comment = mongoose.model<IComment>("Comment", commentSchema);

module.exports = Comment;