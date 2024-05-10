import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { Loading } from "../components/Loading";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const { videos, loading, error } = useVideos();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
          </Box>
            <Tooltip title="Upload Video" placement="right">
              <IconButton
                onClick={() => navigate("/upload-video")}
                sx={{ ml: 2 }}
              >
                <AddCircleOutlineIcon sx={{ fontSize: "2.5rem", color: "primary" }} />
              </IconButton>
            </Tooltip>
        </Toolbar>
      </AppBar>

      {error && <h1>{error}</h1>}
      {loading && <Loading />}
      {!loading && <VideoGrid videos={videos} />}
    </>
  );
};
export default HomePage;
