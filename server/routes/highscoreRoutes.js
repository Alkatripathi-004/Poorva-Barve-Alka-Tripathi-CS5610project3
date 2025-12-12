// server/routes/highscoreRoutes.js
const express = require('express');
const router = express.Router();
const {
    submitScore,
    getGlobalHighscores,
    getHighscoresForGame
} = require('../controllers/highscoreController');

router.post('/', submitScore);

router.get('/', getGlobalHighscores);

router.get('/:gameId', getHighscoresForGame);

module.exports = router;