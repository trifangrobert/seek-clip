import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Video }  from "../models/Video";

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <video controls width="100%" style={{ maxHeight: '345px' }}>
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {video.title}
          </Typography>
        </CardContent>
      </Card>
    );
  };
  
export default VideoItem;
