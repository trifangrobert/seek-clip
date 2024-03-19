import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/Users";
import axios from "axios";
import { registerAPI, loginAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string) => void;
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

  const registerUser = async (email: string, password: string) => {
    console.log("Hello from registerUser")
    await registerAPI(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj);
          toast.success("User registered successfully");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };
  
  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", JSON.stringify(res?.data.token));
          const userObj = {
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj);
          toast.success("User logged in successfully");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error);
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