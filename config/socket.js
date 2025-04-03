const socketIO = require('socket.io');
const User = require('../models/User');

// Store active users with socket ID mapping
const activeUsers = new Map();

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on('user_join', async (userId) => {
      if (userId) {
        // Store user in active users map
        activeUsers.set(userId, socket.id);
        
        // Update user's online status in DB
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: true,
            lastSeen: new Date(),
          });
          
          // Broadcast to all users that this user is now online
          io.emit('user_status_change', { userId, isOnline: true });
          
        } catch (error) {
          console.error('Error updating user status:', error);
        }
        
        // Send active users list to the newly connected user
        const activeUserIds = Array.from(activeUsers.keys());
        socket.emit('active_users', activeUserIds);
      }
    });

    // Handle private message
    socket.on('private_message', async (data) => {
      const { recipientId, message } = data;
      const recipientSocketId = activeUsers.get(recipientId);
      
      if (recipientSocketId) {
        // Send message to recipient if they're online
        io.to(recipientSocketId).emit('new_message', message);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { recipientId, isTyping } = data;
      const recipientSocketId = activeUsers.get(recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing_indicator', {
          senderId: data.senderId,
          isTyping,
        });
      }
    });

    // Handle read receipts
    socket.on('message_read', (data) => {
      const { senderId, messageId } = data;
      const senderSocketId = activeUsers.get(senderId);
      
      if (senderSocketId) {
        io.to(senderSocketId).emit('message_read_receipt', { messageId });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Find userId from socket ID
      let disconnectedUserId = null;
      
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }
      
      if (disconnectedUserId) {
        // Remove from active users
        activeUsers.delete(disconnectedUserId);
        
        // Update user's online status in DB
        try {
          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            lastSeen: new Date(),
          });
          
          // Broadcast to all users that this user is now offline
          io.emit('user_status_change', { 
            userId: disconnectedUserId, 
            isOnline: false 
          });
          
        } catch (error) {
          console.error('Error updating offline status:', error);
        }
      }
    });
  });

  return io;
};

module.exports = setupSocket;
