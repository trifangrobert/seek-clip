import axios from "axios";
import { UserProfile } from "../models/UserType";

const userApi = process.env.REACT_APP_API_URL + "/api/user";

export const getUserByUsername = async (
  username: string
): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(userApi + `/username/${username}`);
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error fetching user");
    }
    const user: UserProfile = response.data;
    return user;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(userApi + `/id/${userId}`);
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error fetching user");
    }
    const user: UserProfile = response.data;
    return user;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw error;
  }
}

export const updateUserProfile = async (
  username: string,
  firstName: string,
  lastName: string,
  profilePicture: File | null
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put<UserProfile>(
      userApi + `/update/${username}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response) {
      throw new Error("Error updating user");
    }
    const user: UserProfile = response.data;
    return user;
  } catch (error) {
    console.log("Error updating user: ", error);
    throw error;
  }
};

export const checkFollowing = async (userId: string): Promise<boolean> => {
  try {
    // use fetch
    const token = localStorage.getItem("token");
    const response = await fetch(userApi + "/isFollowing", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followId: userId }),
    });
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error checking following status");
    }
    const data = await response.json();
    console.log("Data: ", data.following);
    return data.following;
  } catch (error) {
    console.log("Error checking following status: ", error);
    throw error;
  }
};

export const getFollowers = async (
  username: string
): Promise<UserProfile[]> => {
  // console.log("Getting followers for: ", username);
  try {
    const response = await axios.get(userApi + `/followers/${username}`);
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error fetching followers");
    }
    const followers: UserProfile[] = response.data;
    return followers;
  } catch (error) {
    console.log("Error fetching followers: ", error);
    throw error;
  }
};

export const getFollowing = async (
  username: string
): Promise<UserProfile[]> => {
  // console.log("Getting following for: ", username);
  try {
    const response = await axios.get<UserProfile[]>(
      userApi + `/following/${username}`
    );
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error fetching following");
    }
    const following: UserProfile[] = response.data;
    return following;
  } catch (error) {
    console.log("Error fetching following: ", error);
    throw error;
  }
};

export const followUser = async (followId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      userApi + "/follow",
      { followId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error following user");
    }

    return true;
  } catch (error) {
    console.log("Error following user: ", error);
    throw error;
  }
};

export const unfollowUser = async (unfollowId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      userApi + "/unfollow",
      { unfollowId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response) {
      throw new Error("No response from server");
    }
    if (response.status !== 200) {
      throw new Error("Error unfollowing user");
    }

    return true;
  } catch (error) {
    console.log("Error unfollowing user: ", error);
    throw error;
  }
};
