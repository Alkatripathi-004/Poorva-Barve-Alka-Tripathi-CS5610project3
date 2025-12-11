import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const GameControls = () => {
    const { resetGame } = useContext(GameContext);
    
    return (
        <div className="game-controls">
            <button onClick={resetGame}>Reset Game</button>
        </div>
    );
};

export default GameControls;