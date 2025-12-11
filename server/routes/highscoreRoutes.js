// server/routes/highscoreRoutes.js
const express = require('express');
const router = express.Router();
const {
    submitScore,
    getGlobalHighscores,
    getHighscoresForGame
} = require('../controllers/highscoreController');

// POST: Submit a score for a completed game
router.post('/', submitScore);

// GET: Get global highscores (sorted by completion count)
router.get('/', getGlobalHighscores);

// GET: Get highscores for a specific game (sorted by fastest time)
router.get('/:gameId', getHighscoresForGame);

module.exports = router;