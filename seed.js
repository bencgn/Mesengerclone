const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const Message = require('./models/Message');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Sample user data
const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'default-avatar.png',
    isOnline: false,
    lastSeen: new Date(),
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'default-avatar.png',
    isOnline: false,
    lastSeen: new Date(),
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    avatar: 'default-avatar.png',
    isOnline: false,
    lastSeen: new Date(),
  },
  {
    username: 'sara_johnson',
    email: 'sara@example.com',
    password: 'password123',
    avatar: 'default-avatar.png',
    isOnline: false,
    lastSeen: new Date(),
  },
];

// Sample message data - will be populated after users are created
let messages = [];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Message.deleteMany({});
    
    console.log('Database cleared');
    
    // Create users with hashed passwords
    const createdUsers = [];
    
    for (const user of users) {
      // Hash password manually (bypass middleware for seeding)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const createdUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      
      createdUsers.push(createdUser);
      
      console.log(`Created user: ${createdUser.username}`);
    }
    
    // Add users as friends
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < createdUsers.length; j++) {
        if (i !== j) {
          createdUsers[i].friends.push(createdUsers[j]._id);
        }
      }
      await createdUsers[i].save();
    }
    
    console.log('Added friend relationships');
    
    // Create sample messages between users
    const timeNow = new Date();
    
    // Sample messages between John and Jane
    messages = [
      {
        sender: createdUsers[0]._id, // John
        recipient: createdUsers[1]._id, // Jane
        content: 'Hey Jane, how are you doing?',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 55), // 55 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 60), // 1 hour ago
      },
      {
        sender: createdUsers[1]._id, // Jane
        recipient: createdUsers[0]._id, // John
        content: 'I\'m good John! Just working on a new project. How about you?',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 50), // 50 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 55), // 55 minutes ago
      },
      {
        sender: createdUsers[0]._id, // John
        recipient: createdUsers[1]._id, // Jane
        content: 'Great to hear that. I\'m also working on something new.',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 45), // 45 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 50), // 50 minutes ago
      },
      {
        sender: createdUsers[1]._id, // Jane
        recipient: createdUsers[0]._id, // John
        content: 'That sounds exciting! Let\'s catch up soon.',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 40), // 40 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 45), // 45 minutes ago
      },
      
      // Sample messages between John and Mike
      {
        sender: createdUsers[0]._id, // John
        recipient: createdUsers[2]._id, // Mike
        content: 'Hey Mike, are you free this weekend?',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 35), // 35 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 40), // 40 minutes ago
      },
      {
        sender: createdUsers[2]._id, // Mike
        recipient: createdUsers[0]._id, // John
        content: 'Yes, I\'m free. What do you have in mind?',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 30), // 30 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 35), // 35 minutes ago
      },
      {
        sender: createdUsers[0]._id, // John
        recipient: createdUsers[2]._id, // Mike
        content: 'I was thinking we could go hiking.',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 25), // 25 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        sender: createdUsers[2]._id, // Mike
        recipient: createdUsers[0]._id, // John
        content: 'Sounds like a plan! What time?',
        contentType: 'text',
        isRead: false,
        createdAt: new Date(timeNow - 1000 * 60 * 25), // 25 minutes ago
      },
      
      // Sample messages between Jane and Sara
      {
        sender: createdUsers[1]._id, // Jane
        recipient: createdUsers[3]._id, // Sara
        content: 'Sara, did you finish the report?',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 20), // 20 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 25), // 25 minutes ago
      },
      {
        sender: createdUsers[3]._id, // Sara
        recipient: createdUsers[1]._id, // Jane
        content: 'Almost done! Just need to review it once more.',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 15), // 15 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 20), // 20 minutes ago
      },
      {
        sender: createdUsers[1]._id, // Jane
        recipient: createdUsers[3]._id, // Sara
        content: 'Great! Let me know when it\'s ready.',
        contentType: 'text',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 10), // 10 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 15), // 15 minutes ago
      },
      {
        sender: createdUsers[3]._id, // Sara
        recipient: createdUsers[1]._id, // Jane
        content: '👍',
        contentType: 'emoji',
        isRead: true,
        readAt: new Date(timeNow - 1000 * 60 * 5), // 5 minutes ago
        createdAt: new Date(timeNow - 1000 * 60 * 10), // 10 minutes ago
      },
    ];
    
    // Insert all messages
    await Message.insertMany(messages);
    
    console.log(`Created ${messages.length} sample messages`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
