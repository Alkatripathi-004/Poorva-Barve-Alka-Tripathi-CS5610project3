import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import Cell from './Cell';

const Board = () => {
    const { board, mode } = useContext(GameContext);
    const boardSizeClass = mode === 'easy' ? 'grid-6x6' : 'grid-9x9';

    return (
        <div className={`sudoku-board ${boardSizeClass}`}>
            {board.map((row, rowIndex) => 
                row.map((cellData, colIndex) => (
                    <Cell 
                        key={`${rowIndex}-${colIndex}`}
                        row={rowIndex}
                        col={colIndex}
                        cellData={cellData}
                    />
                ))
            )}
        </div>
    );
};

export default Board;