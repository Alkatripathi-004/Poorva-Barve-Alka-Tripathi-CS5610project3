// server/logic/sudokuLogic.js

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// --- Main Generator Logic ---

function sudokuGenerator(mode) {
  let size, subgridHeight, subgridWidth, cellsToKeep;

  if (mode === 'normal') {
    size = 9;
    subgridHeight = 3;
    subgridWidth = 3;
    cellsToKeep = Math.floor(Math.random() * 3) + 28; // 28, 29, or 30
  } else if (mode === 'easy') {
    size = 6;
    subgridHeight = 2;
    subgridWidth = 3;
    cellsToKeep = (size * size) / 2; // 18 for a 6x6 board
  } else {
    // Return empty arrays if the mode is invalid
    return { board: [], solution: [] };
  }

  // 1. Create an empty board, using 0 for empty cells to match the app's state
  const board = Array(size).fill(0).map(() => Array(size).fill(0));

  const isValid = (row, col, num) => {
    // Check row
    for (let x = 0; x < size; x++) {
      if (board[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < size; x++) {
      if (board[x][col] === num) return false;
    }
    // Check subgrid
    const startRow = row - row % subgridHeight;
    const startCol = col - col % subgridWidth;
    for (let i = 0; i < subgridHeight; i++) {
      for (let j = 0; j < subgridWidth; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  const solve = () => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) { // Use 0 for empty cells
          const numbers = Array.from({ length: size }, (_, i) => i + 1);
          shuffle(numbers);

          for (const num of numbers) {
            if (isValid(r, c, num)) {
              board[r][c] = num;
              if (solve()) {
                return true;
              }
              board[r][c] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  // 2. Generate a full, valid Sudoku board. This will be our solution.
  solve();
  // Create a deep copy of the solved board to serve as the solution
  const solution = JSON.parse(JSON.stringify(board));

  // 3. Remove numbers from a copy to create the puzzle
  const puzzleBoard = JSON.parse(JSON.stringify(solution));
  let cellsToRemove = size * size - cellsToKeep;
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (puzzleBoard[row][col] !== 0) {
      puzzleBoard[row][col] = 0; // Use 0 for empty cells
      cellsToRemove--;
    }
  }

  // 4. Instead of printing, return the data in the format the app needs
  return { board: puzzleBoard, solution: solution };
}


// --- Functions to be Exported ---

// This is the main function your controller will call.
const generatePuzzle = (mode) => {
    return sudokuGenerator(mode.toLowerCase()); // Ensure mode is lowercase
};

// This is the validation function your context can use.
const checkMove = (board, row, col, num) => {
    // This logic is simplified as it's just for user validation
    const size = board.length;
    let subgridHeight = size === 9 ? 3 : 2;
    let subgridWidth = 3;

    const tempBoard = board.map(r => r.map(c => c.value));
    tempBoard[row][col] = 0; // Temporarily empty the cell for a valid check

    // Check row & column
    for (let i = 0; i < size; i++) {
        if (tempBoard[row][i] === num) return false;
        if (tempBoard[i][col] === num) return false;
    }
    // Check subgrid
    const startRow = row - row % subgridHeight;
    const startCol = col - col % subgridWidth;
    for (let i = 0; i < subgridHeight; i++) {
        for (let j = 0; j < subgridWidth; j++) {
            if (tempBoard[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
};

// --- THE CRUCIAL PART ---
// This line makes the functions available to be `require`'d in other files.
module.exports = {
    generatePuzzle,
    checkMove
};