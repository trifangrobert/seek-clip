import React from "react";
import { Grid } from "@mui/material";
import VideoItem from "./VideoItem";
import { Video } from "../models/VideoType";

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
    const sortedVideos = videos.sort((a, b) => { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() });

    return (
        <Grid container spacing={4} sx={{padding: '20px'}}>
            {sortedVideos.map((video) => (
                // console.log("video: ", video),
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <VideoItem video={video} />
                </Grid>
            ))}
        </Grid>
    )
};

export default VideoGrid;