const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all conversations
router.get('/', messageController.getConversations);

// Get messages with a specific user
router.get('/:userId', messageController.getMessages);

// Send a message
router.post('/', messageController.sendMessage);

module.exports = router;
