const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserDetails, getAllTherapists, getTherapistById, deleteAccount, } = require('../controllers/userController');


router.get('/me', auth, getUserDetails);
router.get('/therapists', getAllTherapists);
router.get('/therapists/:id', getTherapistById);
router.delete('/me', auth, deleteAccount);

module.exports = router;