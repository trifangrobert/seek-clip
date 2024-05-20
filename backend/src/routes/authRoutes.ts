import express from "express";

const { registerUser, loginUser } = require("../controllers/authController");
const { imageUpload } = require("../middleware/multerConfig");

const router = express.Router();

router.post("/register", imageUpload.single("profilePicture"), registerUser);
router.post("/login", loginUser);

export default router;