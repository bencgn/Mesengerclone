// Chat Module
const Chat = (() => {
  // DOM Elements
  const conversationList = document.getElementById('conversation-list');
  const messagesContainer = document.getElementById('messages-container');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const searchInput = document.getElementById('search-input');
  const recipientName = document.getElementById('recipient-name');
  const recipientAvatar = document.getElementById('recipient-avatar');
  const recipientStatus = document.getElementById('recipient-status');
  const recipientStatusText = document.getElementById('recipient-status-text');
  
  // Templates
  const conversationTemplate = document.getElementById('conversation-template');
  const messageTemplate = document.getElementById('message-template');
  
  // Current active conversation
  let activeConversation = null;
  
  // Store conversations data
  let conversations = [];
  
  // Load all conversations
  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load conversations');
      }
      
      const data = await response.json();
      conversations = data;
      
      // Clear the conversation list
      conversationList.innerHTML = '';
      
      // Render each conversation
      conversations.forEach(renderConversation);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };
  
  // Render a single conversation in the sidebar
  const renderConversation = (conversation) => {
    const template = conversationTemplate.content.cloneNode(true);
    const item = template.querySelector('.conversation-item');
    
    item.setAttribute('data-user-id', conversation._id);
    
    const avatar = item.querySelector('.user-avatar img');
    const statusIndicator = item.querySelector('.status-indicator');
    const userName = item.querySelector('.user-name');
    const timeStamp = item.querySelector('.time-stamp');
    const lastMessage = item.querySelector('.last-message');
    const unreadBadge = item.querySelector('.unread-badge');
    
    // Set user info
    if (conversation.partner) {
      avatar.src = conversation.partner.avatar || '/img/default-avatar.png';
      avatar.alt = conversation.partner.username;
      userName.textContent = conversation.partner.username;
      
      // Set online status
      if (conversation.partner.isOnline) {
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
      } else {
        statusIndicator.classList.add('offline');
        statusIndicator.classList.remove('online');
      }
    }
    
    // Set last message info
    if (conversation.lastMessage) {
      lastMessage.textContent = conversation.lastMessage.content;
      
      // Format time
      const messageDate = new Date(conversation.lastMessage.createdAt);
      timeStamp.textContent = formatMessageTime(messageDate);
    }
    
    // Set unread count
    if (conversation.unreadCount && conversation.unreadCount > 0) {
      unreadBadge.textContent = conversation.unreadCount;
      unreadBadge.classList.remove('hidden');
    } else {
      unreadBadge.classList.add('hidden');
    }
    
    // Add click event listener
    item.addEventListener('click', () => {
      setActiveConversation(conversation._id);
    });
    
    // Add to list
    conversationList.appendChild(item);
  };
  
  // Update a conversation in the list
  const updateConversation = (userId, lastMessage = null, isRead = false) => {
    // Find the conversation item
    const conversationItem = document.querySelector(`.conversation-item[data-user-id="${userId}"]`);
    
    if (conversationItem) {
      if (lastMessage) {
        // Update last message text
        const lastMessageEl = conversationItem.querySelector('.last-message');
        lastMessageEl.textContent = lastMessage.content;
        
        // Update timestamp
        const timeStamp = conversationItem.querySelector('.time-stamp');
        const messageDate = new Date(lastMessage.createdAt);
        timeStamp.textContent = formatMessageTime(messageDate);
      }
      
      if (isRead) {
        // Update unread count
        const unreadBadge = conversationItem.querySelector('.unread-badge');
        unreadBadge.classList.add('hidden');
      }
      
      // Move conversation to top of list
      if (conversationList.firstChild !== conversationItem) {
        conversationList.insertBefore(conversationItem, conversationList.firstChild);
      }
    }
  };
  
  // Set active conversation
  const setActiveConversation = async (userId) => {
    // Remove active class from all conversations
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to selected conversation
    const selectedItem = document.querySelector(`.conversation-item[data-user-id="${userId}"]`);
    if (selectedItem) {
      selectedItem.classList.add('active');
    }
    
    // Update active conversation
    activeConversation = userId;
    
    // Enable message input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    
    try {
      // Load user details
      const userResponse = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to load user details');
      }
      
      const userData = await userResponse.json();
      
      // Update recipient info
      recipientName.textContent = userData.username;
      recipientAvatar.src = userData.avatar || '/img/default-avatar.png';
      
      if (userData.isOnline) {
        recipientStatus.classList.add('online');
        recipientStatus.classList.remove('offline');
        recipientStatusText.textContent = 'Online';
      } else {
        recipientStatus.classList.add('offline');
        recipientStatus.classList.remove('online');
        recipientStatusText.textContent = 'Offline';
      }
      
      // Load messages
      await loadMessages(userId);
      
      // Mark conversation as read
      updateConversation(userId, null, true);
      
      // Emit typing stopped event when changing conversations
      Socket.emitTyping(userId, false);
    } catch (error) {
      console.error('Error setting active conversation:', error);
    }
  };
  
  // Load messages for a conversation
  const loadMessages = async (userId) => {
    try {
      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      
      const messages = await response.json();
      
      // Clear messages container
      messagesContainer.innerHTML = '';
      
      // Remove welcome message if present
      const welcomeMessage = messagesContainer.querySelector('.welcome-message');
      if (welcomeMessage) {
        welcomeMessage.remove();
      }
      
      // Render each message
      messages.forEach(message => {
        renderMessage(message);
      });
      
      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  
  // Render a single message
  const renderMessage = (message) => {
    const template = messageTemplate.content.cloneNode(true);
    const item = template.querySelector('.message');
    
    const currentUser = Auth.getCurrentUser();
    const isOutgoing = message.sender._id === currentUser._id;
    
    if (isOutgoing) {
      item.classList.add('outgoing');
    }
    
    item.setAttribute('data-message-id', message._id);
    
    const avatar = item.querySelector('.message-avatar img');
    const messageText = item.querySelector('.message-text');
    const messageTime = item.querySelector('.message-time');
    const messageStatus = item.querySelector('.message-status i');
    
    // Set avatar
    avatar.src = message.sender.avatar || '/img/default-avatar.png';
    avatar.alt = message.sender.username;
    
    // Set message content
    if (message.contentType === 'emoji') {
      messageText.innerHTML = message.content;
      messageText.style.fontSize = '2rem';
    } else {
      messageText.textContent = message.content;
    }
    
    // Format and set time
    const messageDate = new Date(message.createdAt);
    messageTime.textContent = formatMessageTime(messageDate, true);
    
    // Set message status
    if (isOutgoing) {
      if (message.isRead) {
        messageStatus.classList.remove('fa-check');
        messageStatus.classList.add('fa-check-double');
      } else {
        messageStatus.classList.add('fa-check');
        messageStatus.classList.remove('fa-check-double');
      }
    } else {
      // Mark message as read through socket
      Socket.emitMessageRead(message.sender._id, message._id);
    }
    
    // Add to messages container
    messagesContainer.appendChild(item);
  };
  
  // Send a message
  const sendMessage = async () => {
    const content = messageInput.value.trim();
    
    if (!content || !activeConversation) {
      return;
    }
    
    try {
      // Determine if the message is an emoji only
      const contentType = isEmojiOnly(content) ? 'emoji' : 'text';
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: activeConversation,
          content,
          contentType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const message = await response.json();
      
      // Render the message
      renderMessage(message);
      
      // Update conversation in sidebar
      updateConversation(activeConversation, message);
      
      // Clear input
      messageInput.value = '';
      
      // Scroll to bottom
      scrollToBottom();
      
      // Emit typing stopped event
      Socket.emitTyping(activeConversation, false);
      
      // Emit private message event
      Socket.emitPrivateMessage(activeConversation, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle typing status
  const handleTyping = () => {
    if (activeConversation) {
      const isTyping = messageInput.value.trim().length > 0;
      Socket.emitTyping(activeConversation, isTyping);
    }
  };
  
  // Search users/conversations
  const searchUsers = async () => {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
      // Reset to show all conversations
      await loadConversations();
      return;
    }
    
    try {
      const response = await fetch(`/api/users/search?keyword=${keyword}`, {
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const users = await response.json();
      
      // Clear the conversation list
      conversationList.innerHTML = '';
      
      // Create fake conversation objects for rendering
      users.forEach(user => {
        const fakeConversation = {
          _id: user._id,
          partner: user,
          lastMessage: null,
          unreadCount: 0,
        };
        
        renderConversation(fakeConversation);
      });
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  
  // Format timestamp for messages
  const formatMessageTime = (date, withSeconds = false) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', ...(withSeconds ? { second: '2-digit' } : {}) });
    } else {
      // Show date for older messages
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Check if a string contains only emoji
  const isEmojiOnly = (text) => {
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const stripped = text.replace(/\s/g, '');
    return emojiRegex.test(stripped) && stripped.length <= 8;
  };
  
  // Scroll messages container to bottom
  const scrollToBottom = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };
  
  // Add a new message from WebSocket
  const addNewMessage = (message) => {
    // Only add if we're currently viewing this conversation
    if (activeConversation === message.sender._id) {
      renderMessage(message);
      scrollToBottom();
      
      // Mark as read
      Socket.emitMessageRead(message.sender._id, message._id);
    } else {
      // Update the conversation in the sidebar with unread indicator
      const conversation = conversations.find(c => c._id === message.sender._id);
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        conversation.lastMessage = message;
        updateConversation(message.sender._id, message);
      } else {
        // This is a new conversation
        loadConversations();
      }
    }
  };
  
  // Update user status (online/offline)
  const updateUserStatus = (data) => {
    const { userId, isOnline } = data;
    
    // Update in conversation list
    const conversationItem = document.querySelector(`.conversation-item[data-user-id="${userId}"]`);
    if (conversationItem) {
      const statusIndicator = conversationItem.querySelector('.status-indicator');
      
      if (isOnline) {
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
      } else {
        statusIndicator.classList.add('offline');
        statusIndicator.classList.remove('online');
      }
    }
    
    // Update header if this is the active conversation
    if (activeConversation === userId) {
      if (isOnline) {
        recipientStatus.classList.add('online');
        recipientStatus.classList.remove('offline');
        recipientStatusText.textContent = 'Online';
      } else {
        recipientStatus.classList.add('offline');
        recipientStatus.classList.remove('online');
        recipientStatusText.textContent = 'Offline';
      }
    }
  };
  
  // Update message read status
  const updateMessageReadStatus = (messageId) => {
    const messageItem = document.querySelector(`.message[data-message-id="${messageId}"]`);
    
    if (messageItem) {
      const statusIcon = messageItem.querySelector('.message-status i');
      statusIcon.classList.remove('fa-check');
      statusIcon.classList.add('fa-check-double');
    }
  };
  
  // Initialize chat module
  const init = () => {
    // Add event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    messageInput.addEventListener('input', handleTyping);
    
    searchInput.addEventListener('input', searchUsers);
  };
  
  // Public API
  return {
    init,
    loadConversations,
    addNewMessage,
    updateUserStatus,
    updateMessageReadStatus,
  };
})();
