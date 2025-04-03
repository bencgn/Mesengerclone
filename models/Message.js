const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['text', 'emoji'],
    default: 'text',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Index for faster querying of conversations
messageSchema.index({ sender: 1, recipient: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
