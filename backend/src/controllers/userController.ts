import dotenv from "dotenv";
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

dotenv.config();

const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req: any, res: any) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const user = await User.register(email, password, firstName, lastName);
    console.log("this is the user:", user);
    const token = createToken(user._id);
    res.status(200).json({email: user["email"], firstName: user["firstName"], lastName: user["lastName"], token, userId: user["_id"]});
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
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log("this is the user:", user);
    const token = createToken(user._id);
    res.status(200).json({email: user["email"], firstName: user["firstName"], lastName: user["lastName"], token, userId: user["_id"]});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
