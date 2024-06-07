import express from "express";
import { videoUpload } from "../middleware/multerConfig";
import { getAllVideos, getVideosByUser, uploadVideo, updateVideo, deleteVideo, getVideoById, likeVideo, dislikeVideo, getLikes, getDislikes, searchVideos, increaseViewCount } from "../controllers/videoController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/upload", authenticate, videoUpload.single("url"), uploadVideo);
router.get("/search", searchVideos);
router.put("/update/:videoId", authenticate, updateVideo);
router.delete("/delete/:videoId", authenticate, deleteVideo);
router.get("/all", getAllVideos);
router.get("/:videoId", getVideoById);
router.get("/user/:userId", getVideosByUser);
router.post("/:videoId/like", authenticate, likeVideo);
router.post("/:videoId/dislike", authenticate, dislikeVideo);
router.get("/:videoId/likes", getLikes);
router.get("/:videoId/dislikes", getDislikes);
router.post("/view/:videoId", increaseViewCount);


export default router;