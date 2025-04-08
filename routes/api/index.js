const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');
const testRoutes = require('./test-route');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);
router.use('/test', testRoutes);

// Simple test route directly in this file
router.get('/ping', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;
