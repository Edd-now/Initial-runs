const express = require('express');
const router = express.Router();
const { createGroup, joinGroup, leaveGroup, kickUser, getMyGroups, getPublicGroups, editGroup, deleteGroup, addAdmin, removeAdmin, getGroupAdmins } = require('../controllers/groupController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, createGroup);
router.post('/join/:id', auth, joinGroup);
router.post('/leave/:id', auth, leaveGroup);
router.post('/kick/:id', auth, kickUser); // requires { userId } in body
router.post('/add-admin/:id', auth, addAdmin);
router.post('/remove-admin/:id', auth, removeAdmin);
router.get('/mine', auth, getMyGroups);
router.get('/public', auth, getPublicGroups);
router.get('/admins/:id', auth, getGroupAdmins);
router.put('/edit/:id', auth, editGroup);
router.delete('/delete/:id', auth, deleteGroup);


module.exports = router;