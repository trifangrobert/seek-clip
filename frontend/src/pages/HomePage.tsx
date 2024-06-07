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

interface Filters {
  topics: string[];
  popularityRange: number[];
  sortCriteria: string;
}

const defaultFilters: Filters = {
  topics: [],
  popularityRange: [0, 1000],
  sortCriteria: "newest",
};

const HomePage = () => {
  const navigate = useNavigate();
  const { videos, loading, error } = useVideos();
  const [activeFilters, setActiveFilters] = useState<Filters>(defaultFilters);

  const filteredVideos = useCallback(() => {
    // console.log("activeFilters in useCallback: ", activeFilters);
    // filter the videos using the active filters
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

    // console.log("Result before sorting: ", result);
    // sort the videos based on the sort criteria
    if (activeFilters.sortCriteria === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeFilters.sortCriteria === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (activeFilters.sortCriteria === "most-viewed") {
      result.sort((a, b) => b.views - a.views);
    } else if (activeFilters.sortCriteria === "least-viewed") {
      result.sort((a, b) => a.views - b.views);
    }
    // console.log("Result after sorting: ", result);

    return result;
  }, [videos, activeFilters]);

  const handleApplyFilters = (
    topics: string[],
    popularityRange: number[],
    sortCriteria: string
  ) => {
    // console.log("updating filters: ", { topics, popularityRange, sortCriteria });
    setActiveFilters({ topics, popularityRange, sortCriteria });
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
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
        <Box sx={{pl: 2}}>
          <FilterAccordion
            defaultFilters={defaultFilters}
            onApplyFilters={handleApplyFilters}
            filterSearch={false}
          />
        </Box>
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
