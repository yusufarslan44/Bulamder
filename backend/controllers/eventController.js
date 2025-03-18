const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

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
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }

    if (req.file) {
      // Eski resmi Cloudinary'den sil
      if (event.imageUrl) {
        const publicId = event.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy('celikhan/events/' + publicId);
      }

      // Yeni resmi yükle
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'celikhan/events',
        resource_type: 'auto'
      });

      req.body.imageUrl = result.secure_url;
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({
      message: 'Etkinlik başarıyla güncellendi',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik güncellenirken bir hata oluştu' });
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