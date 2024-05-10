import { useAuthContext } from "../context/AuthContext";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import Logo from "../assets/logo_white.png";

const Navbar = () => {
  const { logoutUser, user } = useAuthContext();
  const navigate = useNavigate();

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
        {/* This div pushes everything after it to the right */}
        {user ? (
          <>
            <Typography
              variant="h6"
              component="div"
              style={{ marginRight: "10px" }}
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
