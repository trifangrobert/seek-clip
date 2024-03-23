const Video = require("../models/videoModel");
import { Request, Response } from "express";
import multer from "multer";
import { AuthRequest } from "../middleware/authenticate";

interface VideoRequest extends Request {
  file: Express.Multer.File;
}

const uploadVideo = async (req: AuthRequest, res: Response) => {
  console.log("uploading video...");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!req.userId) {
    return res.status(401).json({ error: "Used ID missing" });
  }

  const url = req.file.path;
  const title = req.body.title;
  const author = req.userId;

  console.log("url: ", url);
  console.log("title: ", title);
  console.log("author: ", author);

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newVideo = new Video({ url, title, author });
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
    const videoUrls = videos.map((video: any) => {
      return {
        ...video._doc,
        url: process.env.BASE_URL + video.url,
      }
    });
    res.status(200).json(videoUrls);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
  }
}

const getVideosByUser = async (req: Request, res: Response) => {
  console.log("getting videos by user...");
  const  { userId } = req.params;
  try {
    const videos = await Video.find({ author: userId });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error getting videos" });
  }
}

export { uploadVideo, getAllVideos, getVideosByUser };
