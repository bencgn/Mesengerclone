const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message to a user
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, contentType = 'text' } = req.body;
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create and save the message
    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content,
      contentType,
    });
    
    // Populate sender information
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username avatar isOnline')
      .populate('recipient', 'username avatar isOnline');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get messages where current user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 }) // Sort by created date ascending
      .populate('sender', 'username avatar isOnline')
      .populate('recipient', 'username avatar isOnline');
    
    // Mark messages as read if current user is the recipient
    await Message.updateMany(
      { sender: userId, recipient: req.user._id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    // Get unique conversation partners
    const sentMessages = await Message.find({ sender: req.user._id })
      .distinct('recipient');
    
    const receivedMessages = await Message.find({ recipient: req.user._id })
      .distinct('sender');
    
    // Combine and remove duplicates
    const conversationPartnerIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get the last message for each conversation
    const conversations = await Promise.all(
      conversationPartnerIds.map(async (partnerId) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, recipient: partnerId },
            { sender: partnerId, recipient: req.user._id },
          ],
        })
          .sort({ createdAt: -1 }) // Get the most recent message
          .populate('sender', 'username avatar isOnline')
          .populate('recipient', 'username avatar isOnline');
        
        // Get unread count
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          recipient: req.user._id,
          isRead: false,
        });
        
        // Get partner user details
        const partner = await User.findById(partnerId)
          .select('username avatar isOnline lastSeen');
        
        return {
          _id: partnerId,
          partner,
          lastMessage,
          unreadCount,
        };
      })
    );
    
    // Sort by most recent message
    conversations.sort((a, b) => {
      return b.lastMessage.createdAt - a.lastMessage.createdAt;
    });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
