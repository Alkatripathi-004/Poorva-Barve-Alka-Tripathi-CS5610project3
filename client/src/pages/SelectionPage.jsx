import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import './SelectionPage.css';

// Icons to randomly assign to games
const gameIcons = [
    '/icons8-sun-48.png',
    '/icons8-breeze-64.png',
    '/icons8-woman-in-lotus-position-48.png',
    '/icons8-morning-48.png',
    '/icons8-start-48.png',
    '/icons8-sudoku-64.png',
];

// Get a consistent icon for a game based on its ID
const getIconForGame = (gameId) => {
    const hash = gameId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gameIcons[hash % gameIcons.length];
};

const SelectionPage = () => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get('/sudoku');
                setGames(response.data);
            } catch (err) {
                setError('Failed to fetch games.');
            }
        };
        fetchGames();
    }, []);

    const handleCreateGame = async (difficulty) => {
        if (!user) {
            setError('You must be logged in to create a game.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/sudoku', { difficulty });
            const { gameId } = response.data;
            navigate(`/game/${gameId}`);
        } catch (err) {
            setError('Failed to create a new game.');
            setIsLoading(false);
        }
    };

    return (
        <div className="selection-page-container">
            <h1>Game Selection</h1>
            <div className="create-game-section">
                <button onClick={() => handleCreateGame('EASY')} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Easy Game'}
                </button>
                <button onClick={() => handleCreateGame('NORMAL')} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Normal Game'}
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}

            <h2>Or Join an Existing Game</h2>
            <ul className="puzzle-list">
                {games.length > 0 ? (
                    games.map((game) => (
                        <li key={game._id} onClick={() => navigate(`/game/${game._id}`)}>
                            <img src={getIconForGame(game._id)} alt="puzzle icon" className="puzzle-icon" />
                            <div className="puzzle-info">
                                <span className="puzzle-title">{game.name}</span>
                                <span className="author">
                                    {game.difficulty} • by {game.createdBy?.username || 'Unknown'} • {format(new Date(game.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No games available. Create one to get started!</p>
                )}
            </ul>
        </div>
    );
};

export default SelectionPage;