const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middlewares/upload');

// Etkinlik oluştur
router.post('/', upload.single('image'), eventController.createEvent);

// Tüm etkinlikleri getir
router.get('/', eventController.getAllEvents);

// Yaklaşan etkinlikleri getir
router.get('/upcoming', eventController.getUpcomingEvents);

// Etkinlik güncelle
router.put('/:id', upload.single('image'), eventController.updateEvent);

// Etkinlik sil
router.delete('/:id', eventController.deleteEvent);

module.exports = router; 