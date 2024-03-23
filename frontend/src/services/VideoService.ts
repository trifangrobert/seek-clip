import { Video } from "../models/VideoType";

const videoAPI = process.env.REACT_APP_API_URL + "/api/video";

export const getAllVideos = async (): Promise<Video[]> => {
    try {
        const response = await fetch(videoAPI + "/all");
        if (!response.ok) {
            throw new Error("Error fetching videos");
        }
        const videos: Video[] = await response.json();
        return videos;
    }
    catch (error) {
        console.log("Error fetching videos: ", error);
        throw error;
    }
}