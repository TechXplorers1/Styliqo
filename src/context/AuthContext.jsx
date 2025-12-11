import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const { user, initialize } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize auth state
        initialize();
        setLoading(false);
    }, [initialize]);

    const value = {
        user,
        loading
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
