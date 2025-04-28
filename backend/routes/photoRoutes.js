const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const upload = require('../middlewares/upload');
const authenticateToken = require('../middlewares/authenticateToken');

// Fotoğraf yükleme
router.post('/', authenticateToken, upload.single('image'), photoController.uploadPhoto);

// Tüm fotoğrafları getir
router.get('/', photoController.getAllPhotos);

// Kategoriye göre fotoğrafları getir
router.get('/category/:category', photoController.getPhotosByCategory);

// Fotoğraf sil
router.delete('/:id', authenticateToken, photoController.deletePhoto);

module.exports = router; 