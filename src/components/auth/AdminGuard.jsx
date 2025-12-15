import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminGuard = ({ children }) => {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Check if user is logged in AND is the specific admin
    if (!user || user.email !== 'admin@gmail.com') {
        // Redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminGuard;
