const Video = require("../models/videoModel");
const User = require("../models/authModel");
const esClient = require("../config/elasticsearchClient");

import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { getTranscription } from "../utils/transcription";
import { getTopic } from "../utils/topic";
import { promises as fs } from "fs";
import path from "path";
import { craftPopulateUser } from "../utils/craftQuery";

const uploadVideo = async (req: AuthRequest, res: Response) => {
  console.log("uploading video...");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!req.userId) {
    return res.status(401).json({ error: "User ID missing" });
  }
  const file = req.file;
  const url = req.file.path;
  const title = req.body.title;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  const authorId = req.userId;
  const subtitlesDir = "captions/";
  const subtitlesFilename = path.basename(url, path.extname(url)) + ".vtt";
  const subtitles = path.join(subtitlesDir, subtitlesFilename);

  console.log("url: ", url);
  console.log("title: ", title);
  console.log("author: ", authorId);
  console.log("hashtags: ", hashtags);

  if (!title) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const transcription = await getTranscription(file);
  console.log("transcription: ", transcription);

  const topic = await getTopic(title + description + transcription);
  console.log("topic: ", topic);

  try {
    const newVideo = new Video({
      url,
      title,
      description,
      authorId,
      likes: [],
      dislikes: [],
      transcription,
      subtitles,
      topic,
      hashtags,
    });
    await newVideo.save();

    await esClient.index({
      index: 'videos',
      id: newVideo._id.toString(),
      body: {
        title: newVideo.title,
        description: newVideo.description,
        transcription: newVideo.transcription,
        topic: newVideo.topic,
      }
    });
    res.status(201).json({ message: "Video uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video" });
  }
};

// only the creator of the video can update it
const updateVideo = async (req: AuthRequest, res: Response) => {
  console.log("updating video...");
  const { videoId } = req.params;
  const title = req.body.title;
  const description = req.body.description;
  const hashtags = req.body.hashtags;
  console.log(req.body);
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.authorId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update video" });
    }

    console.log("Old title: ", video.title);
    console.log("Old description: ", video.description);

    console.log("New title: ", title);
    console.log("New description: ", description);

    console.log("Old hashtags: ", video.hashtags);
    console.log("New hashtags: ", hashtags);

    video.title = title || video.title;
    video.description = description || video.description;
    video.hashtags = hashtags || video.hashtags;
    console.log("Updated video: ", video);
    await video.save();

    await esClient.update({
      index: 'videos',
      id: video._id.toString(),
      body: {
        doc: {
          title: video.title,
          description: video.description,
        }
      }
    });

    res.status(200).json({ message: "Video updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating video" });
  }
};

// only the creator of the video can delete it
const deleteVideo = async (req: AuthRequest, res: Response) => {
  console.log("deleting video...");
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    console.log("video.authorId: ", video.authorId.toString());
    console.log("req.userId: ", req.userId);

    if (video.authorId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete video" });
    }

    const videoPath = video.url;
    const audioPath = path.basename(videoPath, path.extname(videoPath)) + ".mp3";
    const captionsPath = video.subtitles;

    try {
      await fs.unlink(videoPath);
      await fs.unlink(audioPath);
      await fs.unlink(captionsPath);
      console.log("Files deleted successfully");
    } catch (error) {
      console.log("Error deleting files from disk: ", error);
    }

    await Video.findByIdAndDelete(videoId);

    await esClient.delete({
      index: 'videos',
      id: videoId
    });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video" });
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  console.log("getting all videos...");
  try {
    const videos = await Video.find().populate("authorId", craftPopulateUser());
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
  }
};

const getVideosByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(`getting videos by user ${userId}`);
  try {
    const videos = await Video.find({ authorId: userId }).populate("authorId", craftPopulateUser());
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
  }
};

const getVideoById = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  console.log(`getting video ${videoId}`);
  try {
    const video = await Video.findById(videoId).populate("authorId", craftPopulateUser());
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error getting video" });
  }
};


// access endpoint: POST /api/video/:id/like
const likeVideo = async (req: AuthRequest, res: Response) => {
  console.log("User: ", req.userId);
  console.log("Liking video: ", req.params.videoId);
  const videoId = req.params.videoId;
  const userId = req.userId;
  try {
    const video = await Video.findById(videoId);

    // check if video exists
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let resMessage = "Video liked";

    // check if user has already liked the video
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(
        (id: string) => id.toString() !== userId
      );
      resMessage = "Like removed";
    } else {
      // check if user has disliked the video and remove the dislike
      if (video.dislikes.includes(userId)) {
        video.dislikes = video.dislikes.filter(
          (id: string) => id.toString() !== userId
        );
      }
      video.likes.push(userId);
    }

    await video.save();
    res.status(200).json({ message: resMessage });
  } catch (error) {
    res.status(500).json({ message: "Error liking video" });
  }
};

// access endpoint: POST /api/video/:videoId/dislike
const dislikeVideo = async (req: AuthRequest, res: Response) => {
  console.log("User: ", req.userId);
  console.log("Disliking video: ", req.params.videoId);
  const videoId = req.params.videoId;
  const userId = req.userId;
  try {
    const video = await Video.findById(videoId);

    // check if video exists
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let resMessage = "Video disliked";

    // check if user has already disliked the video
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter(
        (id: string) => id.toString() !== userId
      );
      resMessage = "Dislike removed";
    } else {
      // check if user has liked the video and remove the like
      if (video.likes.includes(userId)) {
        video.likes = video.likes.filter(
          (id: string) => id.toString() !== userId
        );
      }
      video.dislikes.push(userId);
    }
    await video.save();

    res.status(200).json({ message: resMessage });
  } catch (error) {
    res.status(500).json({ message: "Error disliking video" });
  }
};

// access endpoint: POST /api/video/:videoId/likes
// returns the ids of users who liked the video
const getLikes = async (req: Request, res: Response) => {
  const videoId = req.params.videoId;
  console.log("getting likes for video: ", videoId);
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const likes = video.likes;
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error getting likes" });
  }
};

// access endpoint: POST /api/video/:videoId/dislikes
// returns the ids of users who disliked the video
const getDislikes = async (req: Request, res: Response) => {
  const videoId = req.params.videoId;
  console.log("getting dislikes for video: ", videoId);
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const dislikes = video.dislikes;
    res.status(200).json(dislikes);
  } catch (error) {
    res.status(500).json({ message: "Error getting dislikes" });
  }
};

// ENDPOINT: GET /api/video/search
const searchVideos = async (req: Request, res: Response) => {
  const { query } = req.query;
  // console.log("searching videos for: ", query);
  try {
    const { body } = await esClient.search({
      index: "videos",
      body: {
        min_score: 1.0, // might need to adjust this
        query: {
          multi_match: {
            query: query,
            fields: ["title", "description", "transcription", "topic"],
            fuzziness: "AUTO",
          },
        },
      },
    });

    // add _id to each video
    const videos = body.hits.hits.map((hit: any) => ({
      ...hit._source,
      _id: hit._id,
    }));
    res.status(200).json(videos);
    // res.status(200).json(body.hits.hits);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  uploadVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideosByUser,
  getVideoById,
  likeVideo,
  dislikeVideo,
  getLikes,
  getDislikes,
  searchVideos,
};
