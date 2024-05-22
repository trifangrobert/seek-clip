import dotenv from "dotenv";
const User = require("../models/authModel");
const jwt = require("jsonwebtoken");

dotenv.config();

const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


const registerUser = async (req: any, res: any) => {
  const { email, username, password, firstName, lastName } = req.body;
  let profilePicture = "profile-pictures/default-profile-picture.png"
  if (req.file) {
    profilePicture = req.file.path;
  }
  
  console.log("registerUser authController: ", email, username, password, firstName, lastName, profilePicture);
  try {
    const user = await User.register(email, username, password, firstName, lastName, profilePicture);
    console.log("this is the user:", user);
    const token = createToken(user._id);
    res.status(200).json({email: user["email"], username: user["username"], firstName: user["firstName"], lastName: user["lastName"], token, _id: user["_id"], profilePicture: user["profilePicture"]});
  } catch (error: any) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({ error: error.message });
    } else if (error.message === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
  }
};

const loginUser = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    console.log("this is the user:", user);
    const token = createToken(user._id);
    res.status(200).json({email: user["email"], username: user["username"], firstName: user["firstName"], lastName: user["lastName"], token, _id: user["_id"], profilePicture: user["profilePicture"]});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = { registerUser, loginUser };
