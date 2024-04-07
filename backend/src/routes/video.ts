import express from "express";
import upload from "../middleware/multerConfig";
import { getAllVideos, getVideosByUser, uploadVideo, getVideoById } from "../controllers/videoController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/upload", authenticate, upload.single("url"), uploadVideo);
router.get("/all", getAllVideos);
router.get("/:videoId", getVideoById);
router.get("/user/:userId", getVideosByUser);

export default router;