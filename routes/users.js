const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserDetails, deleteAccount } = require('../controllers/userController');


router.get('/me', auth, getUserDetails);
router.delete('/me', auth, deleteAccount);

module.exports = router;