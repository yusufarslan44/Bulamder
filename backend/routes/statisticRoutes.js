const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');

// İstatistikleri getir
router.get('/', statisticController.getStatistics);

// Ziyaretçi sayısını artır
router.post('/visitor', statisticController.incrementVisitorCount);

module.exports = router; 