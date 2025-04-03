// Socket Module
const Socket = (() => {
  // Socket instance
  let socket = null;
  
  // Connect to WebSocket server
  const connect = (userId) => {
    // Initialize socket connection
    socket = io();
    
    // Connection established
    socket.on('connect', () => {
      console.log('Socket connected');
      
      // Join as user
      socket.emit('user_join', userId);
    });
    
    // Handle new messages
    socket.on('new_message', (message) => {
      Chat.addNewMessage(message);
    });
    
    // Handle active users updates
    socket.on('active_users', (activeUserIds) => {
      console.log('Active users:', activeUserIds);
    });
    
    // Handle user status changes
    socket.on('user_status_change', (data) => {
      Chat.updateUserStatus(data);
    });
    
    // Handle typing indicators
    socket.on('typing_indicator', (data) => {
      const typingIndicator = document.getElementById('recipient-status-text');
      const { senderId, isTyping } = data;
      
      // Only show typing indicator if this is the active conversation
      const activeConversation = document.querySelector('.conversation-item.active');
      if (activeConversation && activeConversation.getAttribute('data-user-id') === senderId) {
        if (isTyping) {
          typingIndicator.textContent = 'Typing...';
        } else {
          const isOnline = document.getElementById('recipient-status').classList.contains('online');
          typingIndicator.textContent = isOnline ? 'Online' : 'Offline';
        }
      }
    });
    
    // Handle read receipts
    socket.on('message_read_receipt', (data) => {
      Chat.updateMessageReadStatus(data.messageId);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  };
  
  // Disconnect from WebSocket server
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };
  
  // Emit private message
  const emitPrivateMessage = (recipientId, message) => {
    if (socket) {
      socket.emit('private_message', { recipientId, message });
    }
  };
  
  // Emit typing indicator
  const emitTyping = (recipientId, isTyping) => {
    if (socket) {
      const currentUser = Auth.getCurrentUser();
      socket.emit('typing', {
        recipientId,
        senderId: currentUser._id,
        isTyping,
      });
    }
  };
  
  // Emit message read
  const emitMessageRead = (senderId, messageId) => {
    if (socket) {
      socket.emit('message_read', { senderId, messageId });
    }
  };
  
  // Public API
  return {
    connect,
    disconnect,
    emitPrivateMessage,
    emitTyping,
    emitMessageRead,
  };
})();
