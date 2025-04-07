const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const connection = require('../config/connection');

// Clear the collections when the seed script runs
const clearCollections = async () => {
  try {
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Collections cleared');
  } catch (err) {
    console.error('Error clearing collections:', err);
    process.exit(1);
  }
};

// Sample user data
const users = [
  {
    username: 'lucy_dog',
    email: 'lucy@example.com',
    thoughts: [],
    friends: []
  },
  {
    username: 'scruffles_cat',
    email: 'scruffles@example.com',
    thoughts: [],
    friends: []
  },
  {
    username: 'louie_cat',
    email: 'louie@example.com',
    thoughts: [],
    friends: []
  }
];

// Sample thought data - usernames must match users above
const thoughts = [
  {
    thoughtText: 'MongoDB is great for social network applications!',
    username: 'lucy_dog',
    reactions: [
      {
        reactionBody: 'I totally agree!',
        username: 'scruffles_cat'
      },
      {
        reactionBody: 'NoSQL databases are perfect for this!',
        username: 'louie_cat'
      }
    ]
  },
  {
    thoughtText: 'Express.js makes building APIs so much easier.',
    username: 'scruffles_cat',
    reactions: [
      {
        reactionBody: 'Yes! The routing is so clean.',
        username: 'louie_cat'
      }
    ]
  },
  {
    thoughtText: 'Learning Mongoose ODM has been a game changer for me.',
    username: 'louie_cat',
    reactions: [
      {
        reactionBody: 'The schema validation is really helpful!',
        username: 'scruffles_cat'
      },
      {
        reactionBody: 'Makes working with MongoDB much easier.',
        username: 'alex_tech'
      }
    ]
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await clearCollections();
    
    // Add users
    const createdUsers = await User.create(users);
    console.log('Users seeded successfully');
    
    // Create thoughts and associate with users
    for (const thought of thoughts) {
      const createdThought = await Thought.create(thought);
      
      // Find the user who created this thought and update their thoughts array
      await User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughts: createdThought._id } }
      );
    }
    console.log('Thoughts seeded successfully');
    
    // Add friends connections (make lucy and scruffles friends with louie)
    const louie = await User.findOne({ username: 'louie_cat' });
    
    await User.findOneAndUpdate(
      { username: 'lucy_dog' },
      { $addToSet: { friends: louie._id } }
    );
    
    await User.findOneAndUpdate(
      { username: 'scruffles_cat' },
      { $addToSet: { friends: louie._id } }
    );
    console.log('Friend connections created successfully');
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Handle connection errors
connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// When the connection is open, seed the database
connection.once('open', () => {
  console.log('Connected to MongoDB');
  seedDatabase();
});
