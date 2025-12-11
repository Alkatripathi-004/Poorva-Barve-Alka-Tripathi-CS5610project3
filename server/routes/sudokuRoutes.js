// server/routes/sudokuRoutes.js
const express = require('express');
const router = express.Router();
const {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame
} = require('../controllers/sudokuController');

// POST: Create a new game
router.post('/', createGame);

// GET: Get all games
router.get('/', getAllGames);

// GET: Get a specific game by ID
router.get('/:gameId', getGameById);

// PUT: Update a game
router.put('/:gameId', updateGame);

// DELETE: Delete a game
router.delete('/:gameId', deleteGame);

module.exports = router;