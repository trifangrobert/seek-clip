import { useState, useEffect } from "react";
import { getVideoById } from "../services/VideoService";
import { Video } from "../models/VideoType";

export const useVideo = (videoId: string) => {
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async (videoId: string) => {
      try {
        const fetchedVideo = await getVideoById(videoId);
        setVideo(fetchedVideo);
        setError(null);
      } catch (error) {
        setError(`Error fetching video`);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo(videoId);
  }, []);

  return { video, loading, error };
};
