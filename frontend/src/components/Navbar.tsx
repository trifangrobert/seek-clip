import { useAuthContext } from "../context/AuthContext";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";

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

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {user ? (
          <>
          <Typography variant="h6" component="div">
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
