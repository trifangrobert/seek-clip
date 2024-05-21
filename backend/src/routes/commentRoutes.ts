import express from "express";
import { addComment, updateComment, deleteComment, getCommentsForVideo } from "../controllers/commentController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/add", authenticate, addComment);
router.put("/update", authenticate, updateComment);
router.delete("/delete", authenticate, deleteComment);
router.get("/video/:videoId", getCommentsForVideo);

export default router;
