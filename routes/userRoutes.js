const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all users
router.get('/', userController.getUsers);

// Search users
router.get('/search', userController.searchUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update online status
router.put('/status', userController.updateOnlineStatus);

// Add friend
router.put('/friends/:id', userController.addFriend);

module.exports = router;
