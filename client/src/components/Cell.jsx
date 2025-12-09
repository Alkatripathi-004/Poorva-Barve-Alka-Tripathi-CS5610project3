import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const Cell = ({ row, col, cellData }) => {
    const { selectedCell, selectCell, updateCellValue } = useContext(GameContext);

    const isSelected = selectedCell.row === row && selectedCell.col === col;
    const isInitial = cellData.isInitial;
    const isIncorrect = cellData.isIncorrect;

    // Build the className string based on the cell's state
    const cellClasses = [
        'cell',
        isSelected ? 'selected' : '',
        isInitial ? 'initial' : '',
        isIncorrect ? 'incorrect' : ''
    ].join(' ');
    
    const handleFocus = () => {
        if (!isInitial) {
            selectCell(row, col);
        }
    };
    
    const handleChange = (e) => {
        if (!isInitial) {
            updateCellValue(row, col, e.target.value);
        }
    };

    return (
        <input
            type="number"
            className={cellClasses}
            value={cellData.value === 0 ? '' : cellData.value}
            readOnly={isInitial}
            onFocus={handleFocus}
            onChange={handleChange}
        />
    );
};

export default Cell;