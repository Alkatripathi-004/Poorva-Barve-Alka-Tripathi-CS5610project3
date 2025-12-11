// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in when app loads
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await api.get('/users/me');
                setUser(data);
            } catch (err) {
                // User is not logged in - this is expected
                console.log('User not logged in');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/users/login', { username, password });
            setUser(data);
            return data;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };
    
    const logout = async () => {
        try {
            await api.post('/users/logout');
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
            throw err;
        }
    };
    
    const value = {
        user,
        setUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};