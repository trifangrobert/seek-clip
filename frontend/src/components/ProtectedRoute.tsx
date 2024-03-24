import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    // redirect to signin page if user is not authenticated
    const { user } = useAuthContext();
    const location = useLocation();

    return user ? element : <Navigate to="/signin" state={{ from: location }} replace />;
}

export default ProtectedRoute;