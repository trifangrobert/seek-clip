import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Video } from "../models/Video";

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  return (
    <Card sx={{ maxWidth: 350 }}>
      <Box
        sx={{
          width: "100%",
          height: 0,
          paddingTop: "56.25%", // 16:9
          position: "relative",
        }}
      >
        <video controls width="100%" style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
         }}>
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {video.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoItem;
