import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { GameProvider, GameContext } from '../context/GameContext'; // GameContext is still useful for in-game state
import { AuthContext } from '../context/AuthContext';
import Board from '../components/Board.jsx';
import Timer from '../components/Timer.jsx';
import GameControls from '../components/GameControls.jsx';
import './GamePage.css';

// This is the main component that renders the game UI
const GameUI = () => {
    const { isComplete, gameData } = useContext(GameContext); // Get gameData from context
    
    // If the game is already completed by the current user, show the solution
    if (gameData.isAlreadyCompleted) {
        return (
            <div className="game-page">
                <h2>Game Already Completed</h2>
                <p>You solved this puzzle! Here is the solution.</p>
                {/* We need to pass the solution to the Board component */}
                <Board solvedBoard={gameData.solution} />
            </div>
        );
    }
    
    return (
        <div className="game-page">
            {isComplete && <div className="congratulations-message">Congratulations! You solved it!</div>}
            <Timer />
            <Board />
            {/* The reset button is still useful for clearing user progress on the current puzzle */}
            <GameControls /> 
        </div>
    );
};

const GamePage = () => {
    const { gameId } = useParams();
    const { user } = useContext(AuthContext);
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await api.get(`/sudoku/${gameId}`);
                const fetchedGame = response.data;

                // Check if the current user has already completed this game
                const isAlreadyCompleted = user && fetchedGame.completedBy.some(c => c.user === user._id);
                
                setGameData({ ...fetchedGame, isAlreadyCompleted });
                setLoading(false);
            } catch (err) {
                setError('Failed to load game data.');
                setLoading(false);
            }
        };

        if (gameId) {
            fetchGame();
        }
    }, [gameId, user]);

    if (loading) return <div className="loading-message">Loading Game...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // We pass the fetched game data into the GameProvider
    return (
        <GameProvider initialGameData={gameData}>
            <GameUI />
        </GameProvider>
    );
};

export default GamePage;