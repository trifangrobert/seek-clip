import { profile } from "console";

const User = require("../models/authModel");
const fs = require("fs");


const getUserByUsername = async (req: any, res: any) => {
  console.log("Getting user by username...");
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    console.log("this is the user:", user);
    res.status(200).json({
      email: user["email"],
      username: user["username"],
      firstName: user["firstName"],
      lastName: user["lastName"],
      _id: user["_id"],
      profilePicture: user["profilePicture"],
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

interface UpdateUserProfile {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const updateUserProfile = async (req: any, res: any) => {
  console.log("Updating user profile...");
  const { username, firstName, lastName } = req.body;

  let updateData: UpdateUserProfile = {
    username: username,
    firstName: firstName,
    lastName: lastName,
  };

  if (req.file) {
    updateData.profilePicture = req.file.path;

    try {
      // if the user already has a profile picture, delete it
      const user = await User.findOne({ username });

      if (user["profilePicture"] !== "profile-pictures/default-profile-picture.png") {
        fs.unlinkSync(user["profilePicture"]);
      }
    }
    catch (error: any) {
      console.log("Error deleting profile picture:", error);
    }
  }

  try {
    const user = await User.findOneAndUpdate(
        { username },
        updateData,
        { new: true }
    );

    // get the updated user
    const updatedUser = await User.findOne({ username });

    console.log("this is the udpated user:", updatedUser);
    res.status(200).json({
      email: updatedUser["email"],
      username: updatedUser["username"],
      firstName: updatedUser["firstName"],
      lastName: updatedUser["lastName"],
      profilePicture: updatedUser["profilePicture"],
      _id: updatedUser["_id"],
    });

    console.log("User profile updated successfully");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export { getUserByUsername, updateUserProfile };
