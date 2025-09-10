const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.me);

module.exports = router;
