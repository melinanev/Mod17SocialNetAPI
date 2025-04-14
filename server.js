const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Direct test route in server.js
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is healthy' });
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Import routes only after successful DB connection
  const userRoutes = require('./routes/api/user-routes');
  const thoughtRoutes = require('./routes/api/thought-routes');
  
  // Apply routes directly without nesting
  app.use('/api/users', userRoutes);
  app.use('/api/thoughts', thoughtRoutes);
  
  // Add another test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API test route working!' });
  });

  // Catch-all for undefined routes
  app.use((req, res) => {
    res.status(404).send('Route not found');
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
})
.catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Catch JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ error: 'Invalid JSON format' });
  }
  next();
});
