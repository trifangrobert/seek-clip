import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/UserType";
import axios from "axios";
import { registerAPI, loginAPI } from "../services/AuthService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { updateUserProfile } from "../services/UserService";
import { Socket, io } from "socket.io-client";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  socket: Socket | null;
  registerUser: (email: string, username: string, password: string, firstName: string, lastName: string, profilePicture: File) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  isLoggedIn: () => boolean;
  updateProfile: (username: string, firstName: string, lastName: string, profilePicture: File) => void;
};

type Props = {
  children: React.ReactNode;
};

const AuthContext = createContext<UserContextType>(
  {} as UserContextType
);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  const initSocketConnection = (token: string) => {
    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      query: { token },
      transports: ["websocket"],
    });
    setSocket(newSocket);
    // console.log(`User token ${token} is connected to socket.`);
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      initSocketConnection(token);
    }
    setLoading(false);
  }, []);

  const registerUser = async (email: string, username: string, password: string, firstName: string, lastName: string, profilePicture: File | null) => {
    await registerAPI(email, username, password, firstName, lastName, profilePicture)
      .then((res) => {
        console.log("Response for registerUser: ", res)
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res.data.email,
            username: res.data.username,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            _id: res.data._id,
            profilePicture: res.data.profilePicture,
            premium: res.data.premium
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj);
          initSocketConnection(res?.data.token!);
          toast.success('User registered successfully!', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
            });
            return true;
        }
      })
      .catch((error) => {
        toast.error('User registration failed!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
          });
          return false;
      });

  };
  
  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res.data.email,
            username: res.data.username,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            _id: res.data._id,
            profilePicture: res.data.profilePicture,
            premium: res.data.premium
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          console.log("this is the user:", userObj);
          console.log("this is the token:", res?.data.token);
          setToken(res?.data.token!);
          setUser(userObj);
          initSocketConnection(res?.data.token!);
          toast.success('User logged in successfully!', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
            });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('User login failed!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
          });
      });
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logoutUser = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setSocket(null);
  };

  const updateProfile = async (username: string, firstName: string, lastName: string, profilePicture: File | null) => {
    try {
      const response = await updateUserProfile(username, firstName, lastName, profilePicture);
      console.log("this is the user:", response);
      // update only the modified fields in user state
      const updatedUser = {
        email: response.email,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        profilePicture: response.profilePicture,
        _id: response._id,
        premium: response.premium
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success('User profile updated successfully!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
      
    }
    catch (error) {
      console.log("Error updating user profile: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, socket, loading, registerUser, loginUser, logoutUser, isLoggedIn, updateProfile }}>
      {children}  
    </AuthContext.Provider>
  )
};


export const useAuthContext = () => React.useContext(AuthContext);