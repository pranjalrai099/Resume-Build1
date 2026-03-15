import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('resume_token');
        if (token) {
            try {
                const { data } = await api.getMe();
                setUser(data);
                localStorage.setItem('resume_user', JSON.stringify(data));
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('resume_token');
                localStorage.removeItem('resume_user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('resume_token');
        localStorage.removeItem('resume_user');
        setUser(null);
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
