const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const upload = require('../middlewares/upload');

// Fotoğraf yükleme
router.post('/', upload.single('image'), photoController.uploadPhoto);

// Tüm fotoğrafları getir
router.get('/', photoController.getAllPhotos);

// Kategoriye göre fotoğrafları getir
router.get('/category/:category', photoController.getPhotosByCategory);

// Fotoğraf sil
router.delete('/:id', photoController.deletePhoto);

module.exports = router; 