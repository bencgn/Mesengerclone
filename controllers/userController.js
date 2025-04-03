const User = require('../models/User');

// @desc    Get all users (except current user)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ username: 1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users by username or email
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ message: 'Search keyword is required' });
    }
    
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { username: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
          ],
        },
      ],
    })
      .select('-password')
      .sort({ username: 1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user's online status
// @route   PUT /api/users/status
// @access  Private
exports.updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.isOnline = isOnline;
      if (!isOnline) {
        user.lastSeen = Date.now();
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        isOnline: updatedUser.isOnline,
        lastSeen: updatedUser.lastSeen,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a user to friends list
// @route   PUT /api/users/friends/:id
// @access  Private
exports.addFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    
    // Check if friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already friends
    const user = await User.findById(req.user._id);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Already in friends list' });
    }
    
    // Add to friends list for both users
    user.friends.push(friendId);
    await user.save();
    
    friend.friends.push(req.user._id);
    await friend.save();
    
    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
