import { useParams } from "react-router-dom";
import { Video } from "../models/VideoType";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useVideo } from "../hooks/useVideo";
import ReactPlayer from "react-player";

const VideoPage: React.FC = () => {
    const videoId: string = useParams<{id: string}>().id || "";
    const { video, loading, error } = useVideo(videoId);
    console.log("video: ", video);
    return (
    <Card sx={{ maxWidth: 1200, margin: "auto", mt: 4, overflow: "hidden" }}>
        <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
            <ReactPlayer
                url={video?.url}
                playing
                controls
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
            />
        </Box>
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
                {video?.title || "Loading title..."}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
                {video?.author || "Loading author..."}
            </Typography>
            {/* <Typography gutterBottom variant="h5" component="h2">
                {videoId}
            </Typography> */}
        </CardContent>
    </Card>
    );
}

export default VideoPage;