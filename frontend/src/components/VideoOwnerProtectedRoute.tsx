import { useAuthContext } from "../context/AuthContext";
import { Loading } from "./Loading";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVideoById } from "../services/VideoService";

interface VideoOwnerProtectedRouteProps {
    element: React.ReactElement;
}

const VideoOwnerProtectedRoute: React.FC<VideoOwnerProtectedRouteProps> = ({element}) => {
    const { token, loading, user } = useAuthContext();
    const [onwerLoading, setOwnerLoading] = useState<boolean>(true);
    const [owner, setOwner] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>(); // Get video ID from URL
    const location = useLocation();
    console.log("user data from VideoOwnerProtectedRoute: ", user);
    const userId = user?._id;
    // const userId = "123"


    useEffect(() => {
        const checkOwner = async () => {
            try {
                console.log(id, userId)
                if (!id || !userId) {
                    return;
                }

                const video = await getVideoById(id);
                // in case userId fails to get from context use localStorage
                // const user = localStorage.getItem("user");
                // const userId = user ? JSON.parse(user).userId : null;

                if (video.authorId._id === userId) {
                    setOwner(true);
                }
            }
            catch (error) {
                console.error("Error checking owner: ", error);
            }
            setOwnerLoading(false);
        }
        checkOwner();
    }, [id, userId]);

    console.log("loading and ownerLoading: ", loading, onwerLoading)

    if (loading || onwerLoading) {
        return <Loading />;
    }

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return owner ? element : <Navigate to="/home" replace />;
}

export default VideoOwnerProtectedRoute;