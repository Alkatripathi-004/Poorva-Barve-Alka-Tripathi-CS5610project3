// server/controllers/sudokuController.js
const Game = require('../models/Game.js');
const { generatePuzzle } = require('../logic/sudokuLogic.js');
const words = require('../logic/words.js');

// Function to create a unique game name
const createGameName = () => {
    const randomWord = () => words[Math.floor(Math.random() * words.length)];
    return `${randomWord()} ${randomWord()} ${randomWord()}`;
};


// --- Controller Functions ---

/**
 * @desc    Create a new Sudoku game
 * @route   POST /api/sudoku
 * @access  Private (requires user to be logged in)
 */
const createGame = async (req, res) => {
    const { difficulty } = req.body;
    const userId = req.session.user?._id; 

    if (!userId) {
        return res.status(401).json({ message: "You must be logged in to create a game." });
    }

    if (difficulty !== 'EASY' && difficulty !== 'NORMAL') {
        return res.status(400).json({ message: "Invalid difficulty specified. Must be 'EASY' or 'NORMAL'." });
    }

    const { board, solution } = generatePuzzle(difficulty);
    
    try {
        const newGame = new Game({
            name: createGameName(),
            difficulty,
            board,
            solution,
            createdBy: userId,
        });

        await newGame.save();
        
        res.status(201).json({ gameId: newGame._id });

    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ message: "Server error while creating game." });
    }
};

/**
 * @desc    Get a list of all available games
 * @route   GET /api/sudoku
 * @access  Public
 */
const getAllGames = async (req, res) => {
    try {
        const games = await Game.find({})
            
            .populate('createdBy', 'username') 
            .select('name difficulty createdBy createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json(games);

    } catch (error) {
        console.error("Error fetching all games:", error);
        res.status(500).json({ message: "Server error while fetching games." });
    }
};

/**
 * @desc    Get a single game by its ID
 * @route   GET /api/sudoku/:gameId
 * @access  Public
 */
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }

        res.status(200).json(game);

    } catch (error) {
        // Handle cases where the gameId is not a valid MongoDB ObjectId
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: "Game not found." });
        }
        console.error("Error fetching game by ID:", error);
        res.status(500).json({ message: "Server error while fetching game." });
    }
};

/**
 * @desc    Update a game (for grading purposes)
 * @route   PUT /api/sudoku/:gameId
 * @access  Private
 */
const updateGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }

        // Example update: Change the name of the game
        const { name } = req.body;
        if (name) {
            game.name = name;
        }
        
        const updatedGame = await game.save();
        res.status(200).json(updatedGame);

    } catch (error) {
        console.error("Error updating game:", error);
        res.status(500).json({ message: "Server error while updating game." });
    }
};

/**
 * @desc    Delete a game (for grading purposes)
 * @route   DELETE /api/sudoku/:gameId
 * @access  Private
 */
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.gameId);

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }
        
        res.status(200).json({ message: "Game successfully deleted." });

    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ message: "Server error while deleting game." });
    }
};


module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame
};