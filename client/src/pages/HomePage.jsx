import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-page">
            <h1>Sudoku</h1>
            <p>Welcome to the ultimate Sudoku challenge!</p>
            <div className="home-links">
                <Link to="/games">Play the Game</Link>
                <Link to="/rules">View the Rules</Link>
            </div>
        </div>
    );
};

export default HomePage;