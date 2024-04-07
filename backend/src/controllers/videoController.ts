const Video = require("../models/videoModel");
const User = require("../models/userModel");
import { Request, Response } from "express";
import multer from "multer";
import { AuthRequest } from "../middleware/authenticate";
const ObjectId = require("mongoose").Types.ObjectId;

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
    const authorIds = videos.map((video: any) => video.author.toString());
    // console.log("authorIds: ", authorIds);
    // get unique author ids
    const uniqueAuthorIds = [...new Set(authorIds)];
    // console.log("uniqueAuthorIds: ", uniqueAuthorIds);

    // get authors
    const authors = await User.find({ _id: { $in: uniqueAuthorIds } });
    // console.log("authors: ", authors);

    // create author map
    const authorMap = authors.reduce((acc: any, author: any) => {
      acc[author._id] = author;
      return acc;
    }, {});

    const videoUrls = videos.map((video: any) => {
      return {
        ...video._doc,
        url: process.env.BASE_URL + video.url,
        author:
          authorMap[video.author].firstName +
          " " +
          authorMap[video.author].lastName,
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
    const videoUrl = process.env.BASE_URL + video.url;
    video.url = videoUrl;
    res.status(200).json(video);
  }
  catch (error) {
    res.status(500).json({ message: "Error getting video" });
  }
}

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

export { uploadVideo, getAllVideos, getVideosByUser, getVideoById };
