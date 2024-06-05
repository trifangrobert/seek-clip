import { profile } from "console";
import { Request, Response } from "express";

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
      premium: user["premium"],
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  console.log("Getting user by id...");
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    console.log("this is the user:", user);
    res.status(200).json({
      email: user["email"],
      username: user["username"],
      firstName: user["firstName"],
      lastName: user["lastName"],
      _id: user["_id"],
      profilePicture: user["profilePicture"],
      premium: user["premium"],
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

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
      premium: updatedUser["premium"],
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
    followedUser.followers.push(userId.toString());
    user.following.push(followId.toString());

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
  
  console.log("unfollowId: ", unfollowId);
  console.log("userId: ", userId);
  try {
    const unfollowedUser = await User.findById(unfollowId);
    if (!unfollowedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("all good so far");
    // check if the user is not following the user
    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ error: "User is not being followed" });
    }

    // unfollow the user
    unfollowedUser.followers.pull(userId.toString());
    user.following.pull(unfollowId.toString());

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
  console.log("username: ", username);
  try {
    const user = await User.findOne({ username: username });
    // console.log("searching followers for: ", user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log("user found: ", user)
    const followers = user.followers;
    console.log(`${username} is followed by: ${followers}`)

    const followersProfile = await Promise.all(
      followers.map((followerId: any) =>
        User.findById(followerId)
          .then((follower: any) => {
            return {
              email: follower.email,
              username: follower.username,
              firstName: follower.firstName,
              lastName: follower.lastName,
              _id: follower._id,
              profilePicture: follower.profilePicture,
              premium: follower.premium,
            };
          })
          .catch((error: any) => {
            console.log("Error fetching follower: ", error);
            throw error;
          })
      )
    );
      
    res.status(200).json(followersProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowing = async (req: any, res: any) => {
  console.log("Getting user following...");
  const { username } = req.params;
  console.log("username: ", username);
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;
    console.log(`${username} is following: ${following}`)

    const followingProfile = await Promise.all(
      following.map((followingId: any) =>
        User.findById(followingId)
          .then((following: any) => {
            return {
              email: following.email,
              username: following.username,
              firstName: following.firstName,
              lastName: following.lastName,
              _id: following._id,
              profilePicture: following.profilePicture,
              premium: following.premium,
            };
          })
          .catch((error: any) => {
            console.log("Error fetching following: ", error);
            throw error;
          })
      )
    );
    res.status(200).json(followingProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export { getUserByUsername, updateUserProfile, followUser, unfollowUser, isFollowing, getFollowers, getFollowing, getUserById };
