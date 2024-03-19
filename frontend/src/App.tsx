import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import SignUp from './pages/auth/SignUpPage';
// import SignInSidePage from "./pages/auth/SignInSidePage"

function App() {
  return (
    <Routes>
      {/* <Navbar /> */}
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/signin" element={<SignInSidePage />} /> */}

      <Route path="*" element={<SignUp />} />
    </Routes>
  );
}

export default App;
