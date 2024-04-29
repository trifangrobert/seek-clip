const Video = require("../models/videoModel");
const User = require("../models/userModel");
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { getTranscription } from "../utils/transcription";

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
  const authorId = req.userId;
  const subtitles = "captions/" + url.split("/")[1].replace(".mp4", ".vtt");

  console.log("url: ", url);
  console.log("title: ", title);
  console.log("author: ", authorId);

  if (!title) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const transcription = await getTranscription(file);
  console.log("transcription: ", transcription);

  try {
    const newVideo = new Video({
      url,
      title,
      authorId,
      likes: [],
      dislikes: [],
      transcription,
      subtitles,
    });
    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video" });
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  console.log("getting all videos...");
  try {
    const videos = await Video.find();
    const authorIds = videos.map((video: any) => video.authorId.toString());
    // console.log("authorIds: ", authorIds);
    // get unique author ids
    const uniqueAuthorIds = [...new Set(authorIds)];
    // console.log("uniqueAuthorIds: ", uniqueAuthorIds);

    // get authors
    const authors = await User.find({ _id: { $in: uniqueAuthorIds } });

    // create author map
    const authorMap = authors.reduce((acc: any, author: any) => {
      acc[author._id] = author;
      return acc;
    }, {});
    const videoUrls = videos.map((video: any) => {
      // console.log(process.env.BASE_URL);
      // console.log(video.url);
      // console.log(video);
      return {
        ...video._doc,
        url: process.env.BASE_URL + video.url,
        author:
          authorMap[video.authorId].firstName +
          " " +
          authorMap[video.authorId].lastName,
      };
    });
    // simulate slow network
    // setTimeout(() => {
    //   res.status(200).json(videoUrls);
    // }, 1000);
    res.status(200).json(videoUrls);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
  }
};

const getVideoById = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  console.log(`getting video ${videoId}`);
  try {
    const video = await Video.findById(videoId);
    const author = await User.findById(video.authorId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoUrl = process.env.BASE_URL + video.url;
    video.url = videoUrl;
    res
      .status(200)
      .json({
        ...video._doc,
        author: author.firstName + " " + author.lastName,
      });
  } catch (error) {
    res.status(500).json({ message: "Error getting video" });
  }
};

const getVideosByUser = async (req: Request, res: Response) => {
  console.log("getting videos by user...");
  const { userId } = req.params;
  try {
    const videos = await Video.find({ author: userId });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
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
  }
  catch (error) {
    res.status(500).json({ message: "Error getting likes" });
  }
}

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
  }
  catch (error) {
    res.status(500).json({ message: "Error getting dislikes" });
  }
}
    

export {
  uploadVideo,
  getAllVideos,
  getVideosByUser,
  getVideoById,
  likeVideo,
  dislikeVideo,
  getLikes,
  getDislikes,
};
