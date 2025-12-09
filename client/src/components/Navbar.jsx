// client/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Create this CSS file for styling

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">Sudoku</NavLink>
            <div className="navbar-auth">
                {user ? (
                    <>
                        <span className="username-display">Welcome, {user.username}</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="auth-link">Login</NavLink>
                        <NavLink to="/register" className="auth-link">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;