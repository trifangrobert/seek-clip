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

export const getVideoById = async (id: string): Promise<Video> => {
    try {
        const response = await fetch(videoAPI + `/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching video ${id}`);
        }
        const video: Video = await response.json();
        return video;
    }
    catch (error) {
        console.log(`Error fetching video ${id}`, error);
        throw error;
    }
}

export const uploadVideo = async(title: string, url: File): Promise<String> => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    const token = localStorage.getItem("token");
    const response = await fetch(videoAPI + "/upload", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error("Error uploading video!");
    }

    const data = await response.json();
    return data;
}
