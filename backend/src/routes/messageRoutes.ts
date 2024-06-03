import express from "express";
import { getMessages } from "../controllers/messageController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get("/:id", authenticate, getMessages);

export default router;