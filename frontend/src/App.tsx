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
import OwnerProtectedRoute from "./components/OwnerProtectedRoute";

function App() {
  // if the route is protected, we will use the ProtectedRoute component
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
      path: "*",
      element: <HomePage />,
      isUserProtected: true,
      isVideoOwnerProtected: false,
    },
  ];
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, isUserProtected, isVideoOwnerProtected }) => {
          if (isVideoOwnerProtected) {
            return <Route key={path} path={path} element={<OwnerProtectedRoute element={element} />} />;
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
