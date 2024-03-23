import axios from "axios";
import { UserProfileToken } from "../models/Users";

const authApi = process.env.REACT_APP_API_URL + "/api/auth";

// might change the parameters
export const registerAPI = async (email: string, password: string, firstName: string, lastName: string) => {
  const data = await axios.post<UserProfileToken>(authApi + "/register", {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });
  return data;
};

// might change the parameters
export const loginAPI = async (email: string, password: string) => {
  const data = await axios.post<UserProfileToken>(authApi + "/login", {
    email: email,
    password: password,
  });
  return data;
};
