import { useState, useEffect } from "react";
import { getAllVideos } from "../services/VideoService";
import { Video } from "../models/Video";

export const useVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVideos = async() => {
            setLoading(true);
            try {
                const fetchedVideos = await getAllVideos();
                setVideos(fetchedVideos);
                setError(null);
                console.log("fetchedVideos: ", fetchedVideos);
            }
            catch (error) {
                setError("Error fetching videos");
            }
            finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, []);

    return { videos, loading, error };
}