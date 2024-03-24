import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Loading } from "./Loading";

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    // redirect to signin page if user is not authenticated
    const { token, loading } = useAuthContext();
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    return token ? element : <Navigate to="/signin" state={{ from: location }} replace />;
}

export default ProtectedRoute;