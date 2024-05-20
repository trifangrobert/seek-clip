import axios from "axios";
import { UserProfileToken } from "../models/UserType";

const authApi = process.env.REACT_APP_API_URL + "/api/auth";

// might change the parameters
export const registerAPI = async (email: string, username: string, password: string, firstName: string, lastName: string, profilePicture: File | null) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  const data = await axios.post<UserProfileToken>(authApi + "/register", formData);
  return data;
};

// might change the parameters
export const loginAPI = async (username: string, password: string) => {
  const data = await axios.post<UserProfileToken>(authApi + "/login", {
    username: username,
    password: password,
  });
  return data;
};
