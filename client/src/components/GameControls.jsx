import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const GameControls = () => {
    const { newGame, resetGame } = useContext(GameContext);
    return (
        <div className="game-controls">
            <button onClick={resetGame}>Reset</button>
            <button onClick={newGame}>New Game</button>
        </div>
    );
};

export default GameControls;