import { useAuthContext } from "../context/AuthContext";
import {
  AppBar,
  Button,
  Icon,
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
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {user ? (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
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
