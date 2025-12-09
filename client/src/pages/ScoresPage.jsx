import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ScoresPage.css';

const ScoresPage = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await api.get('/highscore');
                setScores(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch high scores", err);
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    if (loading) return <div className="loading-message">Loading High Scores...</div>;

    return (
        <div className="scores-container">
            <h1>High Scores</h1>
            <p>Leaderboard of games by number of completions.</p>
            <div className="scores-table">
                <div className="scores-header">
                    <div>#</div>
                    <div>Game Name</div>
                    <div>Difficulty</div>
                    <div>Completions</div>
                </div>
                {scores.map((score, index) => (
                    <div className="scores-row" key={score.gameId}>
                        <div>{index + 1}</div>
                        <div>{score.gameName}</div>
                        <div>{score.difficulty}</div>
                        <div>{score.completionCount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScoresPage;