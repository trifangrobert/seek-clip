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
import VideoOwnerProtectedRoute from "./components/VideoOwnerProtectedRoute";
import SearchedVideos from "./pages/SearchedVideos";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const routes = [
    {
      path: "/signup",
      element: <SignUpPage />,
      isUserProtected: false,
      isVideoOwnerProtected: false,
    },
    {
      path: "/signin",
      element: <SignInPage />,
      isUserProtected: false,
      isVideoOwnerProtected: false,
    },
    {
      path: "/profile/:username",
      element: <ProfilePage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/",
      element: <HomePage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/home",
      element: <HomePage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/upload-video",
      element: <UploadVideoPage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/video/:id",
      element: <VideoPage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/edit/:id",
      element: <EditVideoPage />,
      isUserProtected: true,
      isVideoOwnerProtected: true,
    },
    {
      path: "/search/:searchTerm",
      element: <SearchedVideos />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/chat/:receiverId",
      element: <ChatPage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "/chat",
      element: <ChatPage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
    {
      path: "*",
      element: <NotFoundPage />,
      isUserProtected: false,
      isVideoOwnerProtected: false,
    },
  ];
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, isUserProtected, isVideoOwnerProtected }) => {
          if (isVideoOwnerProtected) {
            return <Route key={path} path={path} element={<VideoOwnerProtectedRoute element={element} />} />;
          }
          
          if (isUserProtected) {
            return <Route key={path} path={path} element={<ProtectedRoute element={element} />} />;
          }

          return <Route key={path} path={path} element={element} />;
        })}
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
