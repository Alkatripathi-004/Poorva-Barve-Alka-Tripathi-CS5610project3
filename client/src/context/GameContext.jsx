import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const GameContext = createContext();

// ... (Keep the `validateBoard` helper function from the previous version)

export const GameProvider = ({ children, initialGameData }) => {
    const { user } = useContext(AuthContext);
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // Initialize the board from the fetched data
    useEffect(() => {
        if (initialGameData) {
            const formattedBoard = initialGameData.board.map(row => 
                row.map(value => ({
                    value: value,
                    isInitial: value !== 0,
                    isIncorrect: false,
                }))
            );
            setBoard(formattedBoard);
            setInitialBoard(JSON.parse(JSON.stringify(formattedBoard)));
        }
    }, [initialGameData]);
    
    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(initialBoard)));
        setIsComplete(false);
        setTimer(0);
        setIsRunning(true);
    };
    
    // ... (The updateCellValue and selectCell functions remain the same as before)
    
    // Timer Logic
    useEffect(() => {
        let interval;
        if (isRunning && !isComplete) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isComplete]);
    
    // Win Condition Logic
    useEffect(() => {
        if (board.length === 0 || isComplete) return;

        const isFilled = board.every(row => row.every(cell => cell.value !== 0));
        const hasNoErrors = board.every(row => row.every(cell => !cell.isIncorrect));

        if (isFilled && hasNoErrors) {
            const isCorrect = board.every((row, rIndex) => 
                row.every((cell, cIndex) => cell.value === initialGameData.solution[rIndex][cIndex])
            );
            
            if (isCorrect) {
                setIsComplete(true);
                setIsRunning(false);
                
                // --- POST to highscore API when game is won ---
                const submitScore = async () => {
                    try {
                        await api.post('/highscore', { 
                            gameId: initialGameData._id,
                            time: timer,
                            // The user is implicitly known via the session cookie
                        });
                    } catch (err) {
                        console.error("Failed to submit high score", err);
                    }
                };
                submitScore();
            }
        }
    }, [board, initialGameData, isComplete, timer, user]);

    const contextValue = {
        board,
        isComplete,
        timer,
        resetGame,
        // ... (other functions: updateCellValue, selectCell)
        gameData: initialGameData // Pass down the raw game data for the UI
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};