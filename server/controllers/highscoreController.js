// server/controllers/highscoreController.js
const Game = require('../models/Game.js');

/**
 * @desc    Submit a score for a completed game
 * @route   POST /api/highscore
 * @access  Private
 */
const submitScore = async (req, res) => {
    const { gameId, time } = req.body;
    const userId = req.session.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
    }
    if (!gameId || time === undefined) {
        return res.status(400).json({ message: "Game ID and time are required." });
    }

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }

        const alreadyCompleted = game.completedBy.some(entry => entry.user.equals(userId));
        if (alreadyCompleted) {
            return res.status(200).json({ message: "Score already recorded for this game." });
        }

        game.completedBy.push({ user: userId, time });
        await game.save();

        res.status(201).json({ message: "High score recorded successfully." });
    } catch (error) {
        console.error("Error submitting score:", error);
        res.status(500).json({ message: "Server error while submitting score." });
    }
};

/**
 * @desc    Get the global high score list (games sorted by completion count)
 * @route   GET /api/highscore
 * @access  Public
 */
const getGlobalHighscores = async (req, res) => {
    try {
        const games = await Game.find({ 'completedBy.0': { $exists: true } }); // Find games with at least one completion

        const highscores = games.map(game => ({
            gameId: game._id,
            gameName: game.name,
            difficulty: game.difficulty,
            completionCount: game.completedBy.length,
        }));

        highscores.sort((a, b) => b.completionCount - a.completionCount);

        res.status(200).json(highscores);
    } catch (error) {
        console.error("Error fetching global highscores:", error);
        res.status(500).json({ message: "Server error while fetching highscores." });
    }
};

/**
 * @desc    Get high scores for a specific game
 * @route   GET /api/highscore/:gameId
 * @access  Public
 */
const getHighscoresForGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('completedBy.user', 'username');

        if (!game) {
            return res.status(404).json({ message: "Game not found." });
        }
        
        game.completedBy.sort((a, b) => a.time - b.time);

        res.status(200).json(game.completedBy);
    } catch (error) {
        console.error("Error fetching scores for game:", error);
        res.status(500).json({ message: "Server error while fetching scores." });
    }
};


module.exports = {
    submitScore,
    getGlobalHighscores,
    getHighscoresForGame
};