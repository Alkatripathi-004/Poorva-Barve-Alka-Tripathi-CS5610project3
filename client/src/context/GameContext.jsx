import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const GameContext = createContext();

export const GameProvider = ({ children, initialGameData }) => {
    const { user } = useContext(AuthContext);
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [solution, setSolution] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 });
    const [mode, setMode] = useState('normal');

    useEffect(() => {
        if (initialGameData) {
            setSolution(initialGameData.solution);

            const formattedBoard = initialGameData.board.map(row =>
                row.map(value => ({
                    value: value,
                    isInitial: value !== 0,
                    isIncorrect: false,
                }))
            );
            setBoard(formattedBoard);
            setInitialBoard(JSON.parse(JSON.stringify(formattedBoard)));
            setMode(initialGameData.difficulty === 'EASY' ? 'easy' : 'normal');
            setTimer(0);
            setIsComplete(false);
            setIsRunning(true);
        }
    }, [initialGameData]);

    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(initialBoard)));
        setIsComplete(false);
        setTimer(0);
        setIsRunning(true);
        setSelectedCell({ row: -1, col: -1 });
    };

    const selectCell = (row, col) => {
        setSelectedCell({ row, col });
    };

    const updateCellValue = (row, col, value) => {
        const newValue = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(newValue) || newValue < 0 || newValue > 9) return;

        const newBoard = board.map((r, rIndex) =>
            r.map((cell, cIndex) => {
                if (rIndex === row && cIndex === col) {
                    // Check if this value is correct against the solution
                    const isCorrect = newValue === 0 || newValue === solution[row][col];
                    return { ...cell, value: newValue, isIncorrect: !isCorrect };
                }
                return cell;
            })
        );
        setBoard(newBoard);
    };
    
    useEffect(() => {
        let interval;
        if (isRunning && !isComplete) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isComplete]);
    
    useEffect(() => {
        if (board.length === 0 || isComplete || solution.length === 0) return;

        const isFilled = board.every(row => row.every(cell => cell.value !== 0));
        const hasNoErrors = board.every(row => row.every(cell => !cell.isIncorrect));

        if (isFilled && hasNoErrors) {
            const isCorrect = board.every((row, rIndex) => 
                row.every((cell, cIndex) => cell.value === solution[rIndex][cIndex])
            );
            
            if (isCorrect) {
                setIsComplete(true);
                setIsRunning(false);
                
                const submitScore = async () => {
                    try {
                        await api.post('/api/highscore', { 
                            gameId: initialGameData._id,
                            time: timer,
                        });
                    } catch (err) {
                        console.error("Failed to submit high score", err);
                    }
                };
                submitScore();
            }
        }
    }, [board, solution, initialGameData, isComplete, timer]);

    const contextValue = {
        board,
        isComplete,
        timer,
        resetGame,
        selectedCell,
        selectCell,
        updateCellValue,
        mode,
        gameData: initialGameData
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};