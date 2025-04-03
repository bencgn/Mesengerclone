// Main Application Module
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  Auth.init();
  Chat.init();
  Socket.init ? Socket.init() : null;
  Emoji.init();
  
  // Create default avatar if doesn't exist
  createDefaultAvatar();
});

// Create a default avatar image if not exists
function createDefaultAvatar() {
  const img = new Image();
  img.src = '/img/default-avatar.png';
  
  img.onerror = function() {
    // If image doesn't exist, make sure the img directory exists
    fetch('/img')
      .catch(() => {
        console.warn('Creating default avatar placeholder. Please add a real avatar image at /public/img/default-avatar.png');
      });
  };
}
