const path = require("path");
const fs = require("fs");
const Photo = require("../models/Photo");
const { toAbsoluteUrl } = require("../utils/filePaths");

const fsPromises = fs.promises;

const cleanupFiles = async (filePaths = []) => {
  for (const filePath of filePaths) {
    if (!filePath) continue;

    try {
      await fsPromises.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Dosya temizlenemedi:", filePath, error);
      }
    }
  }
};

const deleteLocalFile = async (relativePath) => {
  if (!relativePath || !relativePath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(
    __dirname,
    "..",
    relativePath.replace(/^\//, "")
  );

  try {
    await fsPromises.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Yerel dosya silinemedi:", absolutePath, error);
    }
  }
};

const formatPhoto = (photoDoc, req) => {
  if (!photoDoc) return null;
  const photo =
    typeof photoDoc.toObject === "function" ? photoDoc.toObject() : { ...photoDoc };

  photo.imageUrl = toAbsoluteUrl(req, photo.imageUrl);

  return photo;
};
// Fotoğraf yükle
exports.uploadPhoto = async (req, res) => {
  console.log("req body", req.body);
  console.log("req file", req.file);
  const tempFiles = [];
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Lütfen bir fotoğraf dosyası yükleyin" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    tempFiles.push(req.file.path);

    const photoDoc = new Photo({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: imageUrl,
    });

    await photoDoc.save();
    const photo = formatPhoto(photoDoc, req);

    res.status(201).json({
      message: 'Fotoğraf başarıyla yüklendi',
      photo
    });
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    await cleanupFiles(tempFiles);
    res.status(500).json({ message: 'Fotoğraf yüklenirken bir hata oluştu' });
  }
};

// Tüm fotoğrafları getir
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos.map((photo) => formatPhoto(photo, req)));
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

    res.json(photos.map((photo) => formatPhoto(photo, req)));
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

    await deleteLocalFile(photo.imageUrl);

    await photo.deleteOne();

    res.json({ message: 'Fotoğraf başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Fotoğraf silinirken bir hata oluştu' });
  }
}; 
