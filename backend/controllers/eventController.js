const path = require("path");
const fs = require("fs");
const Event = require("../models/Event");
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

const formatEvent = (eventDoc, req) => {
  if (!eventDoc) return null;
  const event =
    typeof eventDoc.toObject === "function" ? eventDoc.toObject() : { ...eventDoc };

  event.imageUrl = toAbsoluteUrl(req, event.imageUrl);

  return event;
};
// Etkinlik oluştur
exports.createEvent = async (req, res) => {
  const tempFiles = [];
  try {
    console.log("gelen request", req.body);
    console.log("Yüklenen dosya:", req.file);
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      tempFiles.push(req.file.path);
    }

    const eventDoc = new Event({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      imageUrl: imageUrl,
      program: req.body.program
    });

    await eventDoc.save();

    res.status(201).json({
      message: 'Etkinlik başarıyla oluşturuldu',
      event: formatEvent(eventDoc, req)
    });
  } catch (error) {
    console.error('Etkinlik oluşturma hatası:', error);
    await cleanupFiles(tempFiles);
    res.status(500).json({ message: 'Etkinlik oluşturulurken bir hata oluştu' });
  }
};

// Tüm etkinlikleri getir
exports.getAllEvents = async (req, res) => {
  console.log("get all events");
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events.map((event) => formatEvent(event, req)));
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
    res.json(events.map((event) => formatEvent(event, req)));
  } catch (error) {
    res.status(500).json({ message: 'Etkinlikler getirilirken bir hata oluştu' });
  }
};

// Etkinlik güncelle
exports.updateEvent = async (req, res) => {
  const tempFiles = [];
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      await cleanupFiles(req.file ? [req.file.path] : []);
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }

    if (req.file) {
      tempFiles.push(req.file.path);
      await deleteLocalFile(event.imageUrl);
      req.body.imageUrl = `/uploads/${req.file.filename}`;
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
      event: formatEvent(event, req)
    });
  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error);
    await cleanupFiles(tempFiles);
    res.status(500).json({
      message: 'Etkinlik güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Etkinlik sil
exports.deleteEvent = async (req, res) => {
  console.log("delete çalıştı");
  console.log("req body", req.params.id);
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }

    await deleteLocalFile(event.imageUrl);

    await event.deleteOne();

    res.json({ message: 'Etkinlik başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik silinirken bir hata oluştu' });
  }
}; 
