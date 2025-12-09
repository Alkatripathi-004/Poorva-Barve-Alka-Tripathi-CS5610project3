import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const Timer = () => {
    const { timer } = useContext(GameContext);
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    return <div className="timer">Time: {formatTime(timer)}</div>;
};

export default Timer;