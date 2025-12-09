// server/models/Game.js
const mongoose = require('mongoose');
const GameSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['EASY', 'NORMAL'], required: true },
    board: [[Number]],
    solution: [[Number]],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        time: Number,
    }],
}, { timestamps: true });
module.exports = mongoose.model('Game', GameSchema);