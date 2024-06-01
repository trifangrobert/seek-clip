import { useState, useEffect } from "react";
import { getVideoByUserId } from "../services/VideoService";
import { Video } from "../models/VideoType";

export const useVideosByUser = (userId: string) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchVideos = async() => {
            setLoading(true);
            try {
                const fetchedVideos = await getVideoByUserId(userId);
                setVideos(fetchedVideos);
                setError(null);
                // console.log("fetchedVideos by user: ", fetchedVideos);
            }
            catch (error) {
                setError("Error fetching videos");
            }
            finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, [userId]);

    return { videos, loading, error };
}