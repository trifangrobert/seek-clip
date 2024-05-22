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
import { Comments } from "../components/Comments";
import { CommentProvider } from "../context/CommentContext";
import { useAuthContext } from "../context/AuthContext";

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
  const { user } = useAuthContext();

  // console.log("video from VideoPage: ", video);

  useEffect(() => {
    if (video) {
      setSubtitlesURL(process.env.REACT_APP_API_URL + "/" + video.subtitles);
      const userId = user?._id;
      if (userId && video.authorId === userId) setShowEdit(true);
    }
  }, [video]);

  useEffect(() => {
    checkUserReaction();
  }, [video, liked, disliked]);

  const checkUserReaction = async () => {
    // console.log("videoId: ", videoId);
    const likesList = await getLikes(videoId);
    const dislikesList = await getDislikes(videoId);

    const likesListArray = Object.values(likesList);
    const dislikesListArray = Object.values(dislikesList);

    const userId = user?._id;
    // console.log("userId: ", userId);

    if (userId && likesListArray.includes(userId.toString())) {
      setLiked(true);
    }

    if (userId && dislikesListArray.includes(userId.toString())) {
      setDisliked(true);
    }

    setLikeCount(likesListArray.length);
    setDislikeCount(dislikesListArray.length);
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
    <CommentProvider videoId={videoId}>
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
            <Comments videoId={videoId} />
          </Stack>
        </CardContent>
      </Card>
    </CommentProvider>
  );
};

export default VideoPage;
