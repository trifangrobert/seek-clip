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

      if (
        user["profilePicture"] !==
        "profile-pictures/default-profile-picture.png"
      ) {
        fs.unlinkSync(user["profilePicture"]);
      }
    } catch (error: any) {
      console.log("Error deleting profile picture:", error);
    }
  }

  try {
    const user = await User.findOneAndUpdate({ username }, updateData, {
      new: true,
    });

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

const followUser = async (req: any, res: any) => {
  console.log("Following user...");
  const { followId } = req.body;
  const userId = req.userId;

  console.log("followId: ", followId);
  console.log("userId: ", userId);
  try {
    const followedUser = await User.findById(followId);
    if (!followedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("followedUser: ", followedUser);
    console.log("user: ", user);

    // check if the user is already following the user
    if (user.following.includes(followId)) {
      return res.status(400).json({ error: "User is already being followed" });
    }

    // follow the user
    followedUser.followers.push(userId);
    user.following.push(followId);

    // save the changes
    await followedUser.save();
    await user.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const unfollowUser = async (req: any, res: any) => {
  console.log("Unfollowing user...");
  const { unfollowId } = req.body;
  const userId = req.userId;
  try {
    const unfollowedUser = await User.findById(unfollowId);
    if (!unfollowedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if the user is not following the user
    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ error: "User is not being followed" });
    }

    // unfollow the user
    unfollowedUser.followers.pull(userId);
    user.following.pull(unfollowId);

    // save the changes
    await unfollowedUser.save();
    await user.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const isFollowing = async (req: any, res: any) => {
  console.log("Checking if user is following...");
  const { followId } = req.body;
  console.log(req.body)
  const userId = req.userId;
  console.log("followId: ", followId);
  console.log("userId: ", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if the user is following the user
    if (user.following.includes(followId)) {
      return res.status(200).json({ following: true });
    } else {
      return res.status(200).json({ following: false });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowers = async (req: any, res: any) => {
  console.log("Getting user followers...");
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followers = user.followers;
    res.status(200).json({ followers });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowing = async (req: any, res: any) => {
  console.log("Getting user following...");
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;
    res.status(200).json({ following });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export { getUserByUsername, updateUserProfile, followUser, unfollowUser, isFollowing, getFollowers, getFollowing };
