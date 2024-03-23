import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { CircularProgress } from "@mui/material";

const HomePage = () => {
  const { videos, loading, error } = useVideos();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <h1>Home Page</h1>
      <VideoGrid videos={videos} />
    </>
  );
};
export default HomePage;
