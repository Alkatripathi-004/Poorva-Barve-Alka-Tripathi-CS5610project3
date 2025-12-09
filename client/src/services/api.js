// client/src/services/api.js
import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Backend URL
    withCredentials: true,
});
export default api;