import express from "express";
import upload from "../middleware/multerConfig";
import { getAllVideos, getVideosByUser, uploadVideo, getVideoById, likeVideo, dislikeVideo, getLikes, getDislikes } from "../controllers/videoController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/upload", authenticate, upload.single("url"), uploadVideo);
router.get("/all", getAllVideos);
router.get("/:videoId", getVideoById);
router.get("/user/:userId", getVideosByUser);
router.post("/:videoId/like", authenticate, likeVideo);
router.post("/:videoId/dislike", authenticate, dislikeVideo);
router.get("/:videoId/likes", getLikes);
router.get("/:videoId/dislikes", getDislikes);

export default router;