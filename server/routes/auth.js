const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', authenticateAdmin, authController.getMe);

module.exports = router;
