import express from "express";
import { getUserByUsername, updateUserProfile } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const { imageUpload } = require("../middleware/multerConfig");

const router = express.Router();

router.post("/:username", getUserByUsername);
router.put("/update/:username", authenticate, imageUpload.single("profilePicture"), updateUserProfile);

export default router;
