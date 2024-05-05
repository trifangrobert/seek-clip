import { Routes, Route } from "react-router-dom";

import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import VideoPage from "./pages/VideoPage";
import EditVideoPage from "./pages/EditVideoPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import UploadVideoPage from "./pages/UploadVideoPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // if the route is protected, we will use the ProtectedRoute component
  const routes = [
    { path: "/signup", element: <SignUpPage />, isProtected: false },
    { path: "/signin", element: <SignInPage />, isProtected: false },
    { path: "/home", element: <HomePage />, isProtected: true },
    { path: "/upload-video", element: <UploadVideoPage />, isProtected: true },
    { path: "/video/:id", element: <VideoPage />, isProtected: true },
    { path: "/edit/:id", element: <EditVideoPage />, isProtected: true },
    { path: "*", element: <HomePage />, isProtected: true },
  ];
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, isProtected }) =>
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
