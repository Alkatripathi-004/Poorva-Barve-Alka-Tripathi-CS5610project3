require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5001;

// Get client URL from environment or default
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_key_for_your_sessions',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false, 
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    },
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const sudokuRoutes = require('./routes/sudokuRoutes');
const highscoreRoutes = require('./routes/highscoreRoutes');
const userRoutes = require('./routes/userRoutes');
    
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});