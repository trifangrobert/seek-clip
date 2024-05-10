import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid'; 
import { Loading } from '../components/Loading'; 
import { Typography } from '@mui/material';
import { getVideoById, searchVideo } from '../services/VideoService';
import { Video } from '../models/VideoType';

const SearchedVideos = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

useEffect(() => {
    const fetchVideos = async () => {
        try {
            setLoading(true);
            const videosData: Video[] = await searchVideo(searchTerm as string);
            console.log("videosData: ", videosData);
            const videos = await Promise.all(
                videosData.map(async (video) => {
                    const videoData = await getVideoById(video._id);
                    return videoData;
                })
            );
            console.log("videos: ", videos);
            setVideos(videos);
            setLoading(false);
        } catch (error: any) {
            setError('Failed to load videos');
            setLoading(false);
        }
    };

    fetchVideos();
}, [searchTerm]);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>Search results for "{searchTerm}"</Typography>
      <VideoGrid videos={videos} />
    </div>
  );
};

export default SearchedVideos;
