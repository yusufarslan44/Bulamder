const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Fotoğraf yükle
exports.uploadPhoto = async (req, res) => {
  try {
    let imageUrl = '';

    if (req.file) {
      // Resmi base64 formatına çevir
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      // Cloudinary'ye yükle
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'celikhan/photos',
        resource_type: 'auto'
      });

      imageUrl = result.secure_url;
    }

    const photo = new Photo({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: imageUrl
    });

    await photo.save();

    res.status(201).json({
      message: 'Fotoğraf başarıyla yüklendi',
      photo
    });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    res.status(500).json({ message: 'Fotoğraf yüklenirken bir hata oluştu' });
  }
};

// Tüm fotoğrafları getir
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Fotoğraflar getirilirken bir hata oluştu' });
  }
};

// Kategoriye göre fotoğrafları getir
exports.getPhotosByCategory = async (req, res) => {
  try {
    const photos = await Photo.find({ 
      category: req.params.category 
    }).sort({ createdAt: -1 });
    
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Fotoğraflar getirilirken bir hata oluştu' });
  }
};

// Fotoğraf sil
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Fotoğraf bulunamadı' });
    }

    // Resmi Cloudinary'den sil
    if (photo.imageUrl) {
      const publicId = photo.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy('celikhan/photos/' + publicId);
    }

    await photo.deleteOne();

    res.json({ message: 'Fotoğraf başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Fotoğraf silinirken bir hata oluştu' });
  }
}; 