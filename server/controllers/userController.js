// server/controllers/userController.js
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken." });
        }
        const newUser = new User({ username, password });
        await newUser.save();
        
        // Log the user in immediately after registration
        req.session.user = newUser;
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Server error during registration.", error });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password." });
        }
        // Save user to the session
        req.session.user = user;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error during login.", error });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out, please try again." });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.status(200).json({ message: "Logged out successfully." });
    });
};

// THIS IS THE MISSING FUNCTION
const getCurrentUser = (req, res) => {
    if (req.session.user) {
        // If a user is found in the session, send it back
        res.status(200).json(req.session.user);
    } else {
        // If no user is in the session, send a 401 Unauthorized status
        res.status(401).json({ message: "Not authenticated." });
    }
};


module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};