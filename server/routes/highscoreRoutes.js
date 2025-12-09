// server/routes/highscoreRoutes.js
const express = require('express');
const router = express.Router();
const highscoreController = require('../controllers/highscoreController.js');

// GET /api/highscore - Returns the main high score leaderboard
router.get('/', highscoreController.getGlobalHighscores);

// POST /api/highscore - Submits a new score for a completed game
router.post('/', highscoreController.submitScore);

// GET /api/highscore/:gameId - Returns high scores for a specific game
router.get('/:gameId', highscoreController.getHighscoresForGame);

module.exports = router;