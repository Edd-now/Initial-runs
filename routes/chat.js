const express = require('express');
const router = express.Router();
const { getMessagesByRoom } = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/:roomId', auth, getMessagesByRoom);

module.exports = router;