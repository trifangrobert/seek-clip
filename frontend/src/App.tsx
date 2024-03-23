import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/auth/SignUpPage";
import SignIn from "./pages/auth/SignInPage";
import HomePage from "./pages/HomePage";
import { useAuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import UploadVideoPage from "./pages/UploadVideoPage";

function App() {
  const { user } = useAuthContext();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        {!user && <Route path="/signup" element={<SignUp />} />}
        {!user && <Route path="/signin" element={<SignIn />} />}
        {user && <Route path="/upload-video" element={<UploadVideoPage />} />}

        <Route path="*" element={<HomePage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
