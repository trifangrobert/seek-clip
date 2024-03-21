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

  const filePath = req.file.path;
  const title = req.body.title;
  const author = req.userId;

  console.log("filePath: ", filePath);
  console.log("title: ", title);
  console.log("author: ", author);

  try {
    const newVideo = new Video({ filePath, title, author });
    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video" });
  }
};

// TODO - Add a function to get videos (all or by user ID)

export { uploadVideo };
