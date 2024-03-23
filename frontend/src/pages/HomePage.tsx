import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { Loading } from "../components/Loading";
import { CssBaseline } from "@mui/material";

const HomePage = () => {
  const { videos, loading, error } = useVideos();

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      {/* <CssBaseline /> */}
      <h1>Home Page</h1>
      {loading && <Loading />}
      {!loading && <VideoGrid videos={videos} />}
    </>
  );
};
export default HomePage;
