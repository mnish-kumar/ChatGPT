import { createContext, useState, useEffect } from 'react';
import { getMe } from '../API/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth status only once on app mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    
    const value = {
        user,
        setUser,
        loading,
        setLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;