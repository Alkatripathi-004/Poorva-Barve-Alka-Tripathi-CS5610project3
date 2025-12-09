// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session Management ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_key_for_your_sessions',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
}));

// --- Database Connection (UPDATED) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
const sudokuRoutes = require('./routes/sudokuRoutes');
const highscoreRoutes = require('./routes/highscoreRoutes');
const userRoutes = require('./routes/userRoutes');
    
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});