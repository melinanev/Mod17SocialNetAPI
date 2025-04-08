const express = require('express');
const router = express.Router();

// Example route
router.get('/example', (req, res) => {
  res.send('Example route is working!');
});

// Add more routes as needed
// router.post('/another-route', (req, res) => { ... });

module.exports = router;
