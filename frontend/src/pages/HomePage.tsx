// HomePage.tsx
import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VideoGrid from "../components/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { Loading } from "../components/Loading";
import FilterAccordion from "../components/FilterAccordion";
import { Video } from "../models/VideoType";

const HomePage = () => {
  const navigate = useNavigate();
  const { videos, loading, error } = useVideos();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [popularityRange, setPopularityRange] = useState<number[]>([0, 1000]);

  // Filter videos based on the selected criteria
  const filteredVideos = filterVideos(videos);

  function filterVideos(videos: Video[]) {
    return videos.filter((video) => {
      const videoDate = new Date(video.createdAt);
      // const withinPopularity =
      //   video.views >= popularityRange[0] && video.views <= popularityRange[1];
      const topicMatch =
        selectedTopics.length === 0 || selectedTopics.includes(video.topic);
      return topicMatch;
    });
  }

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
            <FilterAccordion
              selectedTopics={selectedTopics}
              onToggleTopic={(topic) =>
                setSelectedTopics((prev) =>
                  prev.includes(topic)
                    ? prev.filter((t) => t !== topic)
                    : [...prev, topic]
                )
              }
              onPopularityChange={setPopularityRange}
            />
          </Box>
          <Tooltip title="Upload Video" placement="right">
            <IconButton
              onClick={() => navigate("/upload-video")}
              sx={{ ml: 2 }}
            >
              <AddCircleOutlineIcon
                sx={{ fontSize: "2.5rem", color: "primary" }}
              />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}
      {loading && <Loading />}
      {!loading && <VideoGrid videos={filteredVideos} />}
    </>
  );
};

export default HomePage;
