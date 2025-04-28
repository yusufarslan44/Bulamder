const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');
const authenticateToken = require('../middlewares/authenticateToken');

// İstatistikleri getir
router.get('/', statisticController.getStatistics);

// Ziyaretçi sayısını artır
router.post('/visitor', authenticateToken, statisticController.incrementVisitorCount);

module.exports = router; 