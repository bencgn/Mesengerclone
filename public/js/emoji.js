// Emoji Module
const Emoji = (() => {
  // DOM Elements
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const messageInput = document.getElementById('message-input');
  
  // Common emojis
  const commonEmojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
    '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
    '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤',
    '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖',
    '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯',
    '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠',
    '👍', '👎', '👌', '✌️', '🤞', '👊', '❤️', '💔', '💯', '🔥'
  ];
  
  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    emojiPicker.classList.toggle('hidden');
    
    // Create emoji items if not already populated
    if (emojiPicker.children.length === 0) {
      populateEmojiPicker();
    }
  };
  
  // Populate emoji picker with emojis
  const populateEmojiPicker = () => {
    commonEmojis.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.classList.add('emoji-item');
      emojiItem.textContent = emoji;
      
      // Add click event to insert emoji
      emojiItem.addEventListener('click', () => {
        insertEmoji(emoji);
      });
      
      emojiPicker.appendChild(emojiItem);
    });
  };
  
  // Insert emoji into message input
  const insertEmoji = (emoji) => {
    const cursorPos = messageInput.selectionStart;
    const text = messageInput.value;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    
    messageInput.value = newText;
    messageInput.focus();
    messageInput.selectionStart = cursorPos + emoji.length;
    messageInput.selectionEnd = cursorPos + emoji.length;
    
    // Trigger input event to update character count, etc.
    const inputEvent = new Event('input', { bubbles: true });
    messageInput.dispatchEvent(inputEvent);
    
    // Hide emoji picker after selection
    emojiPicker.classList.add('hidden');
  };
  
  // Close emoji picker when clicking outside
  const handleClickOutside = (event) => {
    if (!emojiPicker.classList.contains('hidden') && 
        !emojiPicker.contains(event.target) && 
        event.target !== emojiBtn) {
      emojiPicker.classList.add('hidden');
    }
  };
  
  // Initialize emoji module
  const init = () => {
    // Add event listeners
    emojiBtn.addEventListener('click', toggleEmojiPicker);
    document.addEventListener('click', handleClickOutside);
  };
  
  // Public API
  return {
    init
  };
})();
