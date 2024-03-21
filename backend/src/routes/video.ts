import express from "express";
import upload from "../middleware/multerConfig";
import { uploadVideo } from "../controllers/videoController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/upload", authenticate, upload.single("video"), uploadVideo);
// router.post("/upload", authenticate, uploadVideo);

export default router;