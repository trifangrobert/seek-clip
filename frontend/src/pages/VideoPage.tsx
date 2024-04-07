import { useParams } from "react-router-dom";
import { Video } from "../models/VideoType";
import { Card, CardContent, Typography } from "@mui/material";
import { useVideo } from "../hooks/useVideo";
import ReactPlayer from "react-player";

const VideoPage: React.FC = () => {
    const videoId: string = useParams<{id: string}>().id || "";
    const { video, loading, error } = useVideo(videoId);
    console.log("video: ", video);
    return (
    <Card sx={{maxWidth: 800, margin: "auto", mt: 4}}>
        <ReactPlayer url={video?.url} playing controls width="100%" height="100%" />
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
                {videoId}
            </Typography>
        </CardContent>
    </Card>
    );
}

export default VideoPage;