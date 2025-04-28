const express = require('express');
const { login, register, getPendingAdmins, approveAdmin } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/pending', authenticateToken, getPendingAdmins)
router.post('/:id/approve', authenticateToken, approveAdmin)
// router.get('/protected', authenticateToken, getProtectedData);

module.exports = router