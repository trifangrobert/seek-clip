import axios from "axios";
import { UserProfile } from "../models/UserType";

const authApi = process.env.REACT_APP_API_URL + "/api/user";

export const getUserByUsername = async (
  username: string
): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(authApi + `/${username}`);
    if (!response) {
      throw new Error("Error fetching user");
    }
    const user: UserProfile = response.data;
    return user;
  } catch (error) {
    console.log("Error fetching user: ", error);
    throw error;
  }
};

export const updateUserProfile = async (
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  profilePicture: File | null
): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", username);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put<UserProfile>(
      authApi + `/update/${username}`,
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
