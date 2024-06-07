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
  } catch (error) {
    console.log("Error fetching videos: ", error);
    throw error;
  }
};

export const increaseViewCount = async (id: string): Promise<void> => {
  try {
    const response = await fetch(videoAPI + `/view/${id}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Error increasing view count");
    }
    const data = await response.json();
    return data;   
  }
  catch (error) {
    console.log("Error increasing view count: ", error);
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
  } catch (error) {
    console.log(`Error fetching video ${id}`, error);
    throw error;
  }
};

export const getVideoByUserId = async (id: string): Promise<Video[]> => {
  try {
    const response = await fetch(videoAPI + `/user/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching video ${id}`);
    }
    const videos: Video[] = await response.json();
    return videos;
  } catch (error) {
    console.log(`Error fetching video ${id}`, error);
    throw error;
  }
};

export const uploadVideo = async (
  title: string,
  description: string,
  hashtags: string[],
  url: File
): Promise<String> => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  hashtags.forEach(tag => {
    formData.append("hashtags", tag);
  });
  formData.append("url", url);
  console.log(formData);
  const token = localStorage.getItem("token");
  const response = await fetch(videoAPI + "/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error uploading video!");
  }

  const data = await response.json();
  return data;
};

export const updateVideo = async (
  title: string,
  description: string,
  hashtags: string[],
  id: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(videoAPI + `/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, hashtags }),
  });

  if (!response.ok) {
    throw new Error("Error updating video");
  }

  const data = await response.json();
  return data;
}

export const deleteVideo = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(videoAPI + `/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error deleting video");
  }

  const data = await response.json();
  return data;
}

// endpoint: POST /api/video/:id/like
export const likeVideo = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(videoAPI + `/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error liking video");
  }

  const data = await response.json();
  return data;
};

// endpoint: POST /api/video/:id/dislike
export const dislikeVideo = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(videoAPI + `/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error disliking video");
  }

  const data = await response.json();
  return data;
};

//endpoint: GET /api/video/:id/likes
export const getLikes = async (id: string): Promise<number> => {
  const response = await fetch(videoAPI + `/${id}/likes`);
  if (!response.ok) {
    throw new Error("Error fetching likes");
  }
  const data = await response.json();
  return data;
};

//endpoint: GET /api/video/:id/dislikes
export const getDislikes = async (id: string): Promise<number> => {
  const response = await fetch(videoAPI + `/${id}/dislikes`);
  if (!response.ok) {
    throw new Error("Error fetching dislikes");
  }
  const data = await response.json();
  return data;
};

//endpoint: GET /api/video/search
export const searchVideo = async (query: string): Promise<Video[]> => {
  const response = await fetch(videoAPI + `/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Error searching videos");
  }
  const data = await response.json();
  return data;
}