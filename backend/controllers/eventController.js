const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');
const fs = require("fs");
// Etkinlik oluştur
exports.createEvent = async (req, res) => {
  try {
    console.log("gelen request", req.body);
    console.log("Yüklenen dosya:", req.file);
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "celikhan/events",
        resource_type: "auto",
      });

      imageUrl = result.secure_url;
    }
    fs.unlinkSync(req.file.path);
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      imageUrl: imageUrl,
      program: req.body.program
    });

    await event.save();

    res.status(201).json({
      message: 'Etkinlik başarıyla oluşturuldu',
      event
    });
  } catch (error) {
    console.error('Etkinlik oluşturma hatası:', error);
    res.status(500).json({ message: 'Etkinlik oluşturulurken bir hata oluştu' });
  }
};

// Tüm etkinlikleri getir
exports.getAllEvents = async (req, res) => {
  console.log("get all events");
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlikler getirilirken bir hata oluştu' });
  }
};

// Yaklaşan etkinlikleri getir
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlikler getirilirken bir hata oluştu' });
  }
};

// Etkinlik güncelle
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      // Eğer dosya yüklendiyse local dosyayı sil
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }

    // Yeni resim yüklendiyse
    if (req.file) {
      try {
        // Eski resmi Cloudinary'den sil
        if (event.imageUrl) {
          const publicId = event.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy('celikhan/events/' + publicId);
        }

        // Yeni resmi Cloudinary'e yükle
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'celikhan/events',
          resource_type: 'auto'
        });

        // Cloudinary'e yüklendikten sonra local dosyayı sil
        fs.unlinkSync(req.file.path);

        // Yeni resim URL'sini güncelle
        req.body.imageUrl = result.secure_url;
      } catch (uploadError) {
        // Cloudinary yüklemesi başarısız olursa local dosyayı sil
        fs.unlinkSync(req.file.path);
        throw uploadError;
      }
    }

    // Gelen body'den sadece izin verilen alanları al
    const updateFields = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      endDate: req.body.endDate,
      location: req.body.location,
      imageUrl: req.body.imageUrl || event.imageUrl
    }

    // Etkinliği güncelle
    Object.assign(event, updateFields);
    await event.save();

    res.json({
      message: 'Etkinlik başarıyla güncellendi',
      event
    });
  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error);
    res.status(500).json({
      message: 'Etkinlik güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Etkinlik sil
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }

    // Resmi Cloudinary'den sil
    if (event.imageUrl) {
      const publicId = event.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy('celikhan/events/' + publicId);
    }

    await event.deleteOne();

    res.json({ message: 'Etkinlik başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik silinirken bir hata oluştu' });
  }
}; 