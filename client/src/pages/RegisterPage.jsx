import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // We need to call the register API directly
import './FormPages.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext); // We'll manually set the user after successful registration
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !verifyPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== verifyPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Directly call the registration API endpoint
            const response = await api.post('/users/register', { username, password });
            // On success, the backend sends back the new user object
            // We can update the context and log the user in immediately
            setUser(response.data);
            // Redirect to the game selection page
            navigate('/games');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="verify-password">Verify Password</label>
                    <input 
                        type="password" 
                        id="verify-password" 
                        name="verify-password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-button">Create Account</button>
            </form>
            <p className="form-switch-prompt">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;