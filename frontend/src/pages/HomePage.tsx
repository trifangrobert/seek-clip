import React, { useState, useCallback } from "react";
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

interface Filters {
  topics: string[];
  popularityRange: number[];
  sortCriteria: string;
}

const defaultFilters: Filters = {
  topics: [],
  popularityRange: [0, 1000],
  sortCriteria: "date",
};

const HomePage = () => {
  const navigate = useNavigate();
  const { videos, loading, error } = useVideos();
  const [activeFilters, setActiveFilters] = useState<Filters>(defaultFilters);

  console.log("activeFilters: ", activeFilters);
  // Filter videos based on the active filters
  const filteredVideos = useCallback(() => {
    console.log("activeFilters in useCallback: ", activeFilters);
    // First filter the videos
    let result = videos.filter((video) => {
      const withinPopularity =
        video.views >= activeFilters.popularityRange[0] &&
        video.views <= activeFilters.popularityRange[1];
      const topicMatch =
        (activeFilters.topics.length === 0 ||
          activeFilters.topics.includes(video.topic)) &&
        withinPopularity;
      return topicMatch;
    });

    console.log("Result before sorting: ", result);
    // Then sort them based on the selected sort criteria
    if (activeFilters.sortCriteria === "date") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeFilters.sortCriteria === "popularity") {
      result.sort((a, b) => b.views - a.views);
    }
    console.log("Result after sorting: ", result);

    return result;
  }, [videos, activeFilters]);

  const handleApplyFilters = (
    topics: string[],
    popularityRange: number[],
    sortCriteria: string
  ) => {
    console.log("updating filters: ", { topics, popularityRange, sortCriteria });
    setActiveFilters({ topics, popularityRange, sortCriteria });
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
            <FilterAccordion
              defaultFilters={defaultFilters}
              onApplyFilters={handleApplyFilters}
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
      {!loading && <VideoGrid videos={filteredVideos()} />}
    </>
  );
};

export default HomePage;
