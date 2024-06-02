import { useAuthContext } from "../context/AuthContext";
import { AppBar, IconButton, Toolbar, Typography, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import Logo from "../assets/logo_white.png";
import { useState, useEffect } from "react";
import DefaultProfilePicture from "../assets/default-profile-picture.png";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = () => {
  const { logoutUser, user } = useAuthContext();
  const { toggleTheme, currentTheme } = useTheme();
  const navigate = useNavigate();
  const [userProfilePicUrl, setUserProfilePicUrl] = useState<string>(DefaultProfilePicture);

  useEffect(() => {
    if (user) {
      setUserProfilePicUrl(process.env.REACT_APP_API_URL + "/" + user.profilePicture);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  const handleClickLogo = () => {
    navigate("/home");
  };

  const handleClickUser = () => {
    const username = user?.username;
    navigate("/profile/" + username);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <img
          src={Logo}
          onClick={handleClickLogo}
          style={{ width: "100px", cursor: "pointer", flexGrow: 0 }}
          alt="Logo"
        />
        <div style={{ flexGrow: 1 }} />{" "}
        <IconButton onClick={toggleTheme} color="inherit" sx={{ marginRight: 1.5 }}>
          {currentTheme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        {user ? (
          <>
            <Typography onClick={() => navigate("/chat")} variant="h6" component="div" sx={{ mr: 3, cursor: "pointer" }}>
              Chat
            </Typography>

            <Avatar
              src={userProfilePicUrl}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 30, height: 30, marginRight: 2 }}
              onClick={handleClickUser}
              style={{ cursor: "pointer" }}
            />
            <Typography
              variant="h6"
              component="div"
              style={{ marginRight: "10px" }}
              onClick={handleClickUser}
              sx={{ cursor: "pointer" }}
            >
              {/* {user.firstName + " " + user.lastName} */}
              {user.firstName}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="login"
            onClick={handleLogin}
          >
            <LoginIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
