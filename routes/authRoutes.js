const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.registerUser);

// Login user
router.post('/login', authController.loginUser);

// Get user profile (protected route)
router.get('/profile', protect, authController.getUserProfile);

// Logout user (protected route)
router.post('/logout', protect, authController.logoutUser);

module.exports = router;
