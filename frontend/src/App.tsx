import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/auth/SignUpPage";
import SignIn from "./pages/auth/SignInPage";
import HomePage from "./pages/Home";

function App() {
  return (
    <Routes>
      {/* <Navbar /> */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route path="*" element={<SignUp />} />
    </Routes>
  );
}

export default App;
