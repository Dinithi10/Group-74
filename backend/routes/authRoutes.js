const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', auth.protect, auth.authorize('Admin'), authController.getUsers);
router.put('/users/:id', auth.protect, auth.authorize('Admin'), authController.updateUser);
router.delete('/users/:id', auth.protect, auth.authorize('Admin'), authController.deleteUser);
router.get('/me', auth.protect, authController.getProfile);

module.exports = router;
