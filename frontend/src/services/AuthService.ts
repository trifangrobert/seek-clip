import axios from "axios";
import { UserProfileToken } from "../models/Users"; 

const authApi = process.env.REACT_APP_API_URL + "/api/auth";

// might change the parameters
export const registerAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(authApi + "/register", {
            email: email,
            password: password
        });
        return data
    }
    catch (error) {
        console.log(error);
    }
};

// might change the parameters
export const loginAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(authApi + "/login", {
            email: email,
            password: password
        })
        return data;
    }
    catch (error) {
        console.log(error);
    }
}