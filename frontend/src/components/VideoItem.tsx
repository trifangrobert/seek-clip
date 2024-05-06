import { Box, Card, CardContent, Typography } from "@mui/material";
import { Video } from "../models/VideoType";
import { useNavigate } from "react-router-dom";
import { topicColorMap } from "../utils/TopicColors";

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  // console.log("video from VideoItem: ", video);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  const topicColor = topicColorMap[video.topic.toLowerCase()] || "#222831";

  return (
    <Card sx={{ maxWidth: 450, borderLeft: `6px solid ${topicColor}` }} onClick={handleClick}>
      <Box
        sx={{
          width: "100%",
          height: 0,
          paddingTop: "56.25%", // 16:9
          position: "relative",
        }}
      >
        <video
          width="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          // poster={video.thumbnail}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}>
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {video.author}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoItem;
