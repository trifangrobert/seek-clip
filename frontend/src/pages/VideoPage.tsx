import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useVideo } from "../hooks/useVideo";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import {
  likeVideo,
  dislikeVideo,
  getLikes,
  getDislikes,
} from "../services/VideoService";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { topicColorMap } from "../utils/TopicColors";
import EditIcon from "@mui/icons-material/Edit";
import { DescriptionAccordion } from "../components/DescriptionAccordion";

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const videoId: string = useParams<{ id: string }>().id || "";
  const { video, loading, error } = useVideo(videoId);
  const [subtitlesURL, setSubtitlesURL] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  // console.log("video from VideoPage: ", video);

  useEffect(() => {
    if (video) {
      setSubtitlesURL(process.env.REACT_APP_API_URL + "/" + video.subtitles);
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user).userId : null;
      // console.log("CHECK userId: ", userId);
      // console.log("CHECK video.authorId: ", video.authorId);
      // console.log(
      //   "CHECK userId === video.authorId: ",
      //   userId === video.authorId
      // );
      if (userId && video.authorId === userId) setShowEdit(true);
    }
  }, [video]);

  useEffect(() => {
    checkUserReaction();
  }, [video, liked, disliked]);

  const checkUserReaction = async () => {
    // console.log("videoId: ", videoId);
    const likesList = (await getLikes(videoId)).toString();
    const dislikesList = (await getDislikes(videoId)).toString();

    const user = localStorage.getItem("user");
    const userId = JSON.parse(user!).userId;

    // console.log("userId: ", userId);

    if (likesList.includes(userId.toString())) {
      setLiked(true);
    }

    if (dislikesList.includes(userId.toString())) {
      setDisliked(true);
    }

    // console.log("likesList: ", likesList);
    // console.log("dislikesList: ", dislikesList);

    if (likesList === "") {
      setLikeCount(0);
    } else {
      setLikeCount(likesList.split(",").length);
    }

    if (dislikesList === "") {
      setDislikeCount(0);
    } else {
      setDislikeCount(dislikesList.split(",").length);
    }
  };

  const handleLike = async () => {
    try {
      await likeVideo(videoId);
      if (liked) {
        setLiked(false);
      } else {
        setLiked(true);
        setDisliked(false);
      }
    } catch (error) {
      console.log("Error liking video: ", error);
    }
  };

  const handleDislike = async () => {
    try {
      await dislikeVideo(videoId);
      if (disliked) {
        setDisliked(false);
      } else {
        setDisliked(true);
        setLiked(false);
      }
    } catch (error) {
      console.log("Error disliking video: ", error);
    }
  };

  const goToEditPage = () => {
    navigate(`/edit/${videoId}`);
  };

  const topicColor =
    (video && topicColorMap[video.topic.toLowerCase()]) || "#757575";

  // console.log("video: ", video);
  return (
    <Card sx={{ maxWidth: 1200, margin: "auto", mt: 4, overflow: "hidden" }}>
      <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
        {subtitlesURL && video && (
          <ReactPlayer
            url={video?.url}
            playing
            controls
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous",
                },
                tracks: [
                  {
                    kind: "subtitles",
                    src: subtitlesURL,
                    srcLang: "en",
                    default: true,
                    label: "English",
                  },
                ],
              },
            }}
          />
        )}
        <Chip
          label={video?.topic || "Unknown Topic"}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            bgcolor: topicColor,
            color: "#fff",
            borderRadius: "8px",
          }}
        />
      </Box>
      <CardContent>
        <Stack
          direction="column" // Changed to column to stack vertically
          spacing={2} // Adds space between items in the stack
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              sx={{ flexGrow: 1 }}
            >
              {video?.title || "Loading title..."}
              {showEdit && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={goToEditPage}
                  size="small"
                  sx={{ ml: 2, color: "inherit" }} // Ensured color inherits from theme
                >
                  Edit
                </Button>
              )}
            </Typography>
            <Box>
              <Button onClick={handleLike}>
                <Typography component="span" sx={{ mr: 1 }}>
                  {likeCount}
                </Typography>
                <ThumbUpAltIcon color={liked ? "success" : "action"} />
              </Button>
              <Button onClick={handleDislike}>
                <Typography component="span" sx={{ mr: 1 }}>
                  {dislikeCount}
                </Typography>
                <ThumbDownAltIcon color={disliked ? "error" : "action"} />
              </Button>
            </Box>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {video?.author || "Loading author..."}
          </Typography>
          <DescriptionAccordion description={video?.description || ""} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VideoPage;
