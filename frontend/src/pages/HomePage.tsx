import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { Loading } from "../components/Loading";
import { Typography } from "@mui/material";

const HomePage = () => {
  const { videos, loading, error } = useVideos();

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <Typography component="h1" variant="h4" sx={{m: 3}}>Home Page</Typography>
      {loading && <Loading />}
      {!loading && <VideoGrid videos={videos} />}
    </>
  );
};
export default HomePage;
