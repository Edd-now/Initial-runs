const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, journalController.createEntry);
router.get('/', auth, journalController.getAllEntries);
router.get('/', auth, journalController.getUserEntries);
router.get('/:id', auth, journalController.getEntryById);
router.put('/:id', auth, journalController.updateEntry);
router.delete('/:id', auth, journalController.deleteEntry);

module.exports = router;