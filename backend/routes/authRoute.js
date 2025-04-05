const express = require('express');
const { login, } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

// router.post('/register', register)
router.post('/login', login)
// router.get('/protected', authenticateToken, getProtectedData);

module.exports = router