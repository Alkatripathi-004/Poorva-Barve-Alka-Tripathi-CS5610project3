require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5001;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session config - different for local vs production
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_key_for_your_sessions',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,        // Important: Must be false for HTTP (not HTTPS)
        httpOnly: true,       // Good security practice
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax'       // 'lax' is generally safe and works for localhost navigation
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