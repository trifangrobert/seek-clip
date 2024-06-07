import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
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
  increaseViewCount,
} from "../services/VideoService";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { topicColorMap } from "../utils/TopicColors";
import EditIcon from "@mui/icons-material/Edit";
import { DescriptionAccordion } from "../components/DescriptionAccordion";
import { Comments } from "../components/Comments";
import { CommentProvider } from "../context/CommentContext";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import QAModal from "../components/QAModal";
import ShareIcon from "@mui/icons-material/Share";
import ShareModal from "../components/ShareModal";

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const videoId: string = useParams<{ id: string }>().id || "";
  const { video, loading, error } = useVideo(videoId);

  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // console.log("video from VideoPage: ", video);

  useEffect(() => {
    if (!video || !videoId) return;
    const updateShowEdit = () => {
      const userId = user?._id;
      if (userId && video.authorId._id === userId) setShowEdit(true);
    };

    const updateViewCount = async () => {
      try {
        const response = await increaseViewCount(videoId);
        // console.log("View count increased: ", response);
      } catch (error) {
        console.log("Error increasing view count: ", error);
      }
    };

    updateShowEdit();
    updateViewCount();
  }, [videoId, video]);

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

  const handleShareModalOpen = () => {
    setShareModalOpen(true);
  };

  const topicColor =
    (video && topicColorMap[video.topic.toLowerCase()]) || "#757575";

  if (loading || !video || !user) {
    return <Loading />;
  }

  const subtitlesURL = process.env.REACT_APP_API_URL + "/" + video.subtitles;
  const videoURL = process.env.REACT_APP_API_URL + "/" + video.url;
  // console.log("video: ", video);
  return (
    <CommentProvider videoId={videoId}>
      <Card sx={{ maxWidth: 1200, margin: "auto", mt: 4, overflow: "hidden" }}>
        <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
          {subtitlesURL && video && (
            <ReactPlayer
              url={videoURL}
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
          <Stack direction="column" spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                    sx={{ ml: 2, color: "inherit" }}
                  >
                    Edit
                  </Button>
                )}
              </Typography>
              <Box>
                <Button onClick={handleShareModalOpen}>
                  <ShareIcon />
                </Button>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                  mr: 3,
                  "&::-webkit-scrollbar": {
                    height: "8px", 
                    backgroundColor: "transparent", 
                  },
                  "&:hover": {
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                    },
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent", 
                  },
                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "#555",
                    },
                  },
                }}
              >
                {video.hashtags?.map((hashtag, index) => (
                  <Chip
                    key={index}
                    label={`#${hashtag}`}
                    sx={{ cursor: "pointer", mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  fontWeight: "medium",
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                }}
              >
                {video?.views || 0} views
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={
                    process.env.REACT_APP_API_URL +
                    "/" +
                    video.authorId.profilePicture
                  }
                  alt={`${video.authorId.firstName} ${video.authorId.lastName}`}
                  sx={{ width: 35, height: 35 }}
                />
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  onClick={() =>
                    navigate(`/profile/${video.authorId.username}`)
                  }
                  sx={{
                    cursor: "pointer",
                    maxWidth: "fit-content",
                    fontWeight: "bold",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#3f51b5",
                    },
                  }}
                >
                  {video.authorId.firstName + " " + video.authorId.lastName}
                </Typography>
              </Box>
              {/* change to user.premium here */}
              {user && (
                <Button
                  startIcon={<QuestionAnswerIcon />}
                  onClick={handleModalOpen}
                  sx={{ ml: 2 }}
                >
                  Ask GPT about this video
                </Button>
              )}
            </Box>
            <DescriptionAccordion description={video?.description || ""} />
            <Comments videoId={videoId} />
          </Stack>
        </CardContent>
      </Card>
      <QAModal
        open={modalOpen}
        onClose={handleModalClose}
        subtitles={video.transcription || ""}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={window.location.href}
      />
    </CommentProvider>
  );
};

export default VideoPage;
