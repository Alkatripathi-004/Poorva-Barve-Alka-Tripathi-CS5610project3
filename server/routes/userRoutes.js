// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    getCurrentUser
} = require('../controllers/userController');

// POST: Register a new user
router.post('/register', register);

// POST: Login a user
router.post('/login', login);

// POST: Logout a user
router.post('/logout', logout);

// GET: Get current user (this should be /me, not just the root)
router.get('/me', getCurrentUser);

module.exports = router;