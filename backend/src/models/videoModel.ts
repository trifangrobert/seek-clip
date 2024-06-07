import mongoose, { Schema, Document } from "mongoose";

interface IVideo extends Document {
  url: string;
  title: string;
  description: string;
  authorId: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  transcription?: string;
  subtitles?: string;
  topic?: string;
  hashtags?: string[];
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
    description: {
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
    views: {
      type: Number,
      default: 0,
    },
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    transcription: {
      type: String,
    },
    subtitles: {
      type: String,
    },
    topic: {
      type: String,
    },
    hashtags: [
      {
        type: String,
      },
    ],
  },
  { collection: "videos", timestamps: true }
);

const Video = mongoose.model<IVideo>("Video", videoSchema);

module.exports = Video;