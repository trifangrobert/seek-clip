import express from "express";
import { getUserByUsername, updateUserProfile, followUser, unfollowUser, isFollowing, getFollowers, getFollowing } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const { imageUpload } = require("../middleware/multerConfig");

const router = express.Router();

router.post("/isFollowing", authenticate, isFollowing);
router.put("/update/:username", authenticate, imageUpload.single("profilePicture"), updateUserProfile);
router.put("/follow", authenticate, followUser);
router.put("/unfollow", authenticate, unfollowUser);
router.get("/followers/:username", getFollowers);
router.get("/following/:username", getFollowing);
router.post("/:username", getUserByUsername);

export default router;
