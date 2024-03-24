import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/auth/SignUpPage";
import SignIn from "./pages/auth/SignInPage";
import HomePage from "./pages/HomePage";
import { useAuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import UploadVideoPage from "./pages/UploadVideoPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useAuthContext();
  // if the route is protected, we will use the ProtectedRoute component
  const routes = [
    { path: "/home", element: <HomePage />, protected: true },
    { path: "/signup", element: <SignUp />, protected: false },
    { path: "/signin", element: <SignIn />, protected: false },
    { path: "/upload-video", element: <UploadVideoPage />, protected: true },
  ];
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, protected: isProtected }) =>
          isProtected ? (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute element={element} />}
            />
          ) : (
            <Route key={path} path={path} element={element} />
          )
        )}
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
