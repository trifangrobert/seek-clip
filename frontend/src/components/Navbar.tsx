import { useAuthContext } from "../context/AuthContext";
import { AppBar, IconButton, Toolbar, Typography, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import Logo from "../assets/logo_white.png";
import { useState, useEffect } from "react";
import DefaultProfilePicture from "../assets/default-profile-picture.png";

const Navbar = () => {
  const { logoutUser, user } = useAuthContext();
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
    <AppBar position="sticky" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <img
          src={Logo}
          onClick={handleClickLogo}
          style={{ width: "100px", cursor: "pointer", flexGrow: 0 }}
          alt="Logo"
        />
        <div style={{ flexGrow: 1 }} />{" "}
        {user ? (
          <>
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
              {user.firstName + " " + user.lastName}
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
