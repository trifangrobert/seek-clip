import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { Loading } from "../components/Loading";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { videos, loading, error } = useVideos();
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{
        display: "flex",
        // justifyContent: "space-between",
        justifyContent: "center",
        alignItems: "center",
        m: 4,
      }}>
        {/* <Typography component="h1" variant="h4" sx={{ m: 1 }}>
          Home Page
        </Typography> */}
        <Tooltip title="Upload Video" placement="right">
          <IconButton onClick={() => navigate("/upload-video")} sx={{padding: "10px"}}>
            <AddCircleOutlineIcon
              sx={{ fontSize: "2.5rem", color: "#222831" }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {error && <h1>{error}</h1>}
      {loading && <Loading />}
      {!loading && <VideoGrid videos={videos} />}
    </>
  );
};
export default HomePage;
