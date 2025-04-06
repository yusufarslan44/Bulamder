const express = require('express');
const { login, register, } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/:id/approve', login)
// router.get('/protected', authenticateToken, getProtectedData);

module.exports = router