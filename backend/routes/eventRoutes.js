const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middlewares/upload');
const authenticateToken = require('../middlewares/authenticateToken');

// Etkinlik oluştur
router.post('/', authenticateToken, upload.single('image'), eventController.createEvent);

// Tüm etkinlikleri getir
router.get('/', eventController.getAllEvents);

// Yaklaşan etkinlikleri getir
router.get('/upcoming', eventController.getUpcomingEvents);

// Etkinlik güncelle
router.put('/:id', authenticateToken, upload.single('image'), eventController.updateEvent);

// Etkinlik sil
router.delete('/:id', authenticateToken, eventController.deleteEvent);

module.exports = router; 