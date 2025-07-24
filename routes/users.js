const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Example protected route
router.get('/me', auth, (req, res) => {
  res.json({ msg: `Hello user with ID: ${req.user.id}, role: ${req.user.role}` });
});

module.exports = router;