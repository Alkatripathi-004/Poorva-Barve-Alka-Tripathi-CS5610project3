// server/routes/sudokuRoutes.js
const express = require('express');
const router = express.Router();
const sudokuController = require('../controllers/sudokuController');
router.get('/', sudokuController.getAllGames);
router.post('/', sudokuController.createGame);
router.get('/:gameId', sudokuController.getGameById);
router.delete('/:gameId', sudokuController.deleteGame); // For grading
router.put('/:gameId', sudokuController.updateGame);   // For grading
module.exports = router;