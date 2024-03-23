import express from "express";
import upload from "../middleware/multerConfig";
import { getAllVideos, getVideosByUser, uploadVideo } from "../controllers/videoController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/upload", authenticate, upload.single("video"), uploadVideo);
router.get("/all", getAllVideos);
router.get("/user/:userId", getVideosByUser);

export default router;