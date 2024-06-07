import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoGrid from "../components/VideoGrid";
import { Loading } from "../components/Loading";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { getVideoById, searchVideo } from "../services/VideoService";
import { Video } from "../models/VideoType";
import SearchBar from "../components/SearchBar";
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

const SearchedVideos = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videosData: Video[] = await searchVideo(searchTerm as string);
        // console.log("videosData: ", videosData);
        const videos = await Promise.all(
          videosData.map(async (video) => {
            const videoData = await getVideoById(video._id);
            return { ...videoData, score: video.score };
          })
        );
        // console.log("videos: ", videos);
        setVideos(videos);
        setLoading(false);
      } catch (error: any) {
        setError("Failed to load videos");
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchTerm]);

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

    console.log("Result before sorting: ", result);
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
    } else if (activeFilters.sortCriteria === "most-relevant") {
      result.sort((a, b) => {
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        return bScore - aScore;
      });
    } else if (activeFilters.sortCriteria === "least-relevant") {
      result.sort((a, b) => {
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        return aScore - bScore;
      });
    }
    console.log("Result after sorting: ", result);

    return result;
  }, [videos, activeFilters]);

  const handleApplyFilters = (
    topics: string[],
    popularityRange: number[],
    sortCriteria: string
  ) => {
    setActiveFilters({ topics, popularityRange, sortCriteria });
  };

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar />
          </Box>
        </Toolbar>
        <Box sx={{ pl: 2 }}>
          <FilterAccordion
            defaultFilters={defaultFilters}
            onApplyFilters={handleApplyFilters}
            filterSearch={true}
          />
        </Box>
      </AppBar>
      <Typography variant="h5" sx={{ padding: 0.5, ml: 2 }}>
        Search results for "{searchTerm}"
      </Typography>
      <VideoGrid videos={filteredVideos()} />
    </>
  );
};

export default SearchedVideos;
