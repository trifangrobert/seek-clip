import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/Users";
import axios from "axios";
import { registerAPI, loginAPI } from "../services/AuthService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string, firstName: string, lastName: string) => void;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
  isLoggedIn: () => boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log("Hello from registerUser")
    await registerAPI(email, password, firstName, lastName)
      .then((res) => {
        console.log("Response for registerUser: ", res)
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res.data.email,
            firstName: res.data.firstName,
            lastName: res.data.lastName
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj);
          toast.success('User registered successfully!', {
            position: "bottom-center",
            autoClose: 3000,
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
          autoClose: 3000,
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
  
  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res.data.email,
            firstName: res.data.firstName,
            lastName: res.data.lastName
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          console.log("this is the user:", userObj);
          console.log("this is the token:", res?.data.token);
          setToken(res?.data.token!);
          setUser(userObj);
          toast.success('User logged in successfully!', {
            position: "bottom-center",
            autoClose: 3000,
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
          autoClose: 3000,
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, registerUser, loginUser, logoutUser, isLoggedIn }}>
      {children}  
    </AuthContext.Provider>
  )
};


export const useAuthContext = () => React.useContext(AuthContext);