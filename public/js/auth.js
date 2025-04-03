// Authentication Module
const Auth = (() => {
  // DOM Elements
  const authContainer = document.getElementById('auth-container');
  const chatContainer = document.getElementById('chat-container');
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Current user data
  let currentUser = null;
  
  // Show appropriate form based on tab selection
  const switchForms = (showLogin = true) => {
    if (showLogin) {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
    } else {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      loginTab.classList.remove('active');
      registerTab.classList.add('active');
    }
  };
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save user data and token
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: data._id,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
        }));
        
        currentUser = data;
        
        // Show chat interface
        showChatInterface();
        
        // Initialize socket connection
        Socket.connect(data._id);
        
        // Load conversations
        Chat.loadConversations();
      } else {
        alert(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };
  
  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save user data and token
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: data._id,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
        }));
        
        currentUser = data;
        
        // Show chat interface
        showChatInterface();
        
        // Initialize socket connection
        Socket.connect(data._id);
        
        // Load conversations
        Chat.loadConversations();
      } else {
        alert(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Disconnect socket
      Socket.disconnect();
      
      // Clear local storage and show login screen
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      currentUser = null;
      
      // Show auth container and hide chat container
      authContainer.classList.remove('hidden');
      chatContainer.classList.add('hidden');
      
      // Reset forms
      loginForm.reset();
      registerForm.reset();
      switchForms(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('userToken') !== null;
  };
  
  // Get token
  const getToken = () => {
    return localStorage.getItem('userToken');
  };
  
  // Get current user
  const getCurrentUser = () => {
    if (currentUser) {
      return currentUser;
    }
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      currentUser = JSON.parse(userData);
      return currentUser;
    }
    
    return null;
  };
  
  // Show chat interface
  const showChatInterface = () => {
    const user = getCurrentUser();
    
    if (user) {
      // Update UI with user info
      document.getElementById('current-user-name').textContent = user.username;
      
      if (user.avatar) {
        document.getElementById('current-user-avatar').src = user.avatar;
      }
      
      // Hide auth container and show chat container
      authContainer.classList.add('hidden');
      chatContainer.classList.remove('hidden');
    }
  };
  
  // Initialize auth module
  const init = () => {
    // Add event listeners
    loginTab.addEventListener('click', () => switchForms(true));
    registerTab.addEventListener('click', () => switchForms(false));
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Check if user is already logged in
    if (isAuthenticated()) {
      showChatInterface();
      
      // Initialize socket connection
      const user = getCurrentUser();
      if (user) {
        Socket.connect(user._id);
        
        // Load conversations
        Chat.loadConversations();
      }
    }
  };
  
  // Public API
  return {
    init,
    getToken,
    getCurrentUser,
    isAuthenticated,
  };
})();
