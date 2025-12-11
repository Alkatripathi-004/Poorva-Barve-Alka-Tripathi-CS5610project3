// client/src/services/api.js
import axios from 'axios';

// Use environment variable for development, default to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sudoku-server-tqb6.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;