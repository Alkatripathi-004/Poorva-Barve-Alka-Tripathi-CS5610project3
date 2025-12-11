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

        // Log the user in immediately after registration (without password)
        const userResponse = { _id: newUser._id, username: newUser.username };
        req.session.user = userResponse;
        
        // SAVE THE SESSION EXPLICITLY
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Server error during registration.", error: error.message });
            }
            res.status(201).json(userResponse);
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration.", error: error.message });
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
        // Save user to the session (without password)
        const userResponse = { _id: user._id, username: user.username };
        req.session.user = userResponse;
        
        // SAVE THE SESSION EXPLICITLY
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Server error during login.", error });
            }
            res.status(200).json(userResponse);
        });
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