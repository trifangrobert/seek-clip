import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

interface IVideo extends Document {
  url: string;
  title: string;
  authorId: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  transcription?: string;
}

const videoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    transcription: {
      type: String,
    },
  },
  { collection: "videos", timestamps: true }
);

const Video = mongoose.model<IVideo>("Video", videoSchema);

module.exports = Video;