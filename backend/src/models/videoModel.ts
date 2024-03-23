import mongoose, { Schema } from "mongoose";
import {Document} from "mongoose";

interface IVideo extends Document {
    url: string;
    title: string;
    author: Schema.Types.ObjectId;
}

const videoSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { collection: "videos", timestamps: true });

const Video = mongoose.model<IVideo>("Video", videoSchema);

module.exports = Video;