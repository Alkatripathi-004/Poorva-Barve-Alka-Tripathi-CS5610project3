// client/src/services/api.js
import axios from 'axios';

// Use hardcoded backend URL for production
const API_BASE_URL = 'https://sudoku-server-tqb6.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;