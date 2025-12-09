// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await api.get('/users/me');
                setUser(data);
            } catch (err) {
                // This is expected if the user isn't logged in
                setUser(null);
            } finally {
                // This will now run correctly
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post('/users/login', { username, password });
        setUser(data);
    };
    
    const logout = async () => {
        await api.post('/users/logout');
        setUser(null);
    };
    
    return (
        // The closing tag is now correct
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {/* We can restore the loading logic now */}
            {!loading && children}
        </AuthContext.Provider>
    );
};