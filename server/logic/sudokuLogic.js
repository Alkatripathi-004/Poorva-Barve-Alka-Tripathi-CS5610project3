// server/logic/sudokuLogic.js - Dynamic Sudoku Puzzle Generator

function validInRow(row, num, board) {
    for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === num) {
            return false;
        }
    }
    return true;
}

function validInColumn(col, num, board, boardSize) {
    for (let row = 0; row < boardSize; row++) {
        if (board[row][col] === num) {
            return false;
        }
    }
    return true;
}

function validInGrid(row, col, num, board, subgridHeight, subgridWidth) {
    const startRow = Math.floor(row / subgridHeight) * subgridHeight;
    const startCol = Math.floor(col / subgridWidth) * subgridWidth;

    for (let r = startRow; r < startRow + subgridHeight; r++) {
        for (let c = startCol; c < startCol + subgridWidth; c++) {
            if (board[r][c] === num) {
                return false;
            }
        }
    }
    return true;
}

function isNumValid(row, col, num, board, boardSize, subgridHeight, subgridWidth) {
    return validInRow(row, num, board) &&
           validInColumn(col, num, board, boardSize) &&
           validInGrid(row, col, num, board, subgridHeight, subgridWidth);
}

function createEmptyBoard(boardSize) {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
        board.push(new Array(boardSize).fill(0));
    }
    return board;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function populateBoard(board, boardSize) {
    const subgridHeight = boardSize === 9 ? 3 : 2;
    const subgridWidth = 3;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const numbers = [];
            for (let i = 1; i <= boardSize; i++) {
                numbers.push(i);
            }
            shuffleArray(numbers);

            let placed = false;
            for (let num of numbers) {
                if (isNumValid(row, col, num, board, boardSize, subgridHeight, subgridWidth)) {
                    board[row][col] = num;
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                
                for (let r = 0; r < boardSize; r++) {
                    for (let c = 0; c < boardSize; c++) {
                        board[r][c] = 0;
                    }
                }
                row = -1;
                break;
            }
        }
    }
}

function removeRandomCells(board, boardSize) {
    const totalCellsToRemove = boardSize === 9 ? 51 : 18;

    let removed = 0;
    while (removed < totalCellsToRemove) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
}

function buildSudokuPuzzle(boardSize) {
    const board = createEmptyBoard(boardSize);
    populateBoard(board, boardSize);

    const solution = board.map(row => [...row]);

    removeRandomCells(board, boardSize);

    return { board, solution };
}

const generatePuzzle = (mode) => {
    const normalizedMode = mode.toUpperCase();
    let boardSize;
    
    if (normalizedMode === 'EASY') {
        boardSize = 6;
    } else if (normalizedMode === 'NORMAL') {
        boardSize = 9;
    } else {
        throw new Error("Invalid mode. Must be 'EASY' or 'NORMAL'");
    }
    
    return buildSudokuPuzzle(boardSize);
};

const isMoveValid = (board, row, col, num) => {
    const size = board.length;
    for (let i = 0; i < size; i++) {
        if (board[row][i] === num && col !== i) return false;
        if (board[i][col] === num && row !== i) return false;
    }
    if (size === 9) {
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (board[r][c] === num && (r !== row || c !== col)) return false;
            }
        }
    } else if (size === 6) {
        const boxRow = Math.floor(row / 2) * 2;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 2; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (board[r][c] === num && (r !== row || c !== col)) return false;
            }
        }
    }
    return true;
};

const checkMove = (board, row, col, num) => {
    const tempBoard = board.map(r => r.map(c => c.value));
    const originalValue = tempBoard[row][col];
    tempBoard[row][col] = 0;
    const isValid = isMoveValid(tempBoard, row, col, num);
    tempBoard[row][col] = originalValue;
    return isValid;
};

module.exports = {
    generatePuzzle,
    checkMove
};