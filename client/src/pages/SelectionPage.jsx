import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Our Axios instance
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import './SelectionPage.css';

const SelectionPage = () => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Fetch the list of games when the component mounts
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
    }, []); // Empty dependency array means this runs once on mount

    // Function to handle creating a new game
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
            // Redirect the user to the new game page
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
            <div className="game-list">
                {games.length > 0 ? (
                    games.map((game) => (
                        <div key={game._id} className="game-list-item" onClick={() => navigate(`/game/${game._id}`)}>
                            <div className="game-name">{game.name}</div>
                            <div className="game-details">
                                <span>Difficulty: {game.difficulty}</span>
                                <span>Creator: {game.createdBy.username}</span>
                                <span>Created: {format(new Date(game.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No games available. Create one to get started!</p>
                )}
            </div>
        </div>
    );
};

export default SelectionPage;