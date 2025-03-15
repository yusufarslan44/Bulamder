const News = require("../models/News");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createNews = async (req, res) => {
  console.log("Gelen request body:", req.body);
  console.log("Yüklenen dosya bilgisi:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "Resim dosyası yüklenmedi!" });
  }

  try {
    let imageUrl = "";

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "celikhan/events",
      resource_type: "auto",
    });

    imageUrl = result.secure_url;

    fs.unlinkSync(req.file.path);

    // Veritabanına kaydet
    const news = await News.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: imageUrl,
      isFeatured: req.body.isFeatured === "true",
    });

    res.status(201).json({
      status: "success",
      news,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort("-createdAt");
    const featuredNews = await News.findOne({ isFeatured: true });

    res.status(200).json({
      status: "success",
      count: news.length,
      featuredNews,
      news,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    res.status(200).json({
      status: "success",
      news,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category }).sort(
      "-createdAt"
    );

    res.status(200).json({
      status: "success",
      count: news.length,
      news,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getFeaturedNews = async (req, res) => {
  try {
    const featuredNews = await News.findOne({ isFeatured: true });

    res.status(200).json({
      status: "success",
      featuredNews,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    if (req.file) {
      // Eski resmi cloudinary'den sil
      await cloudinary.uploader.destroy(news.imageUrl);

      // Yeni resmi yükle
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "news",
      });

      // Geçici dosyayı sil
      fs.unlinkSync(req.file.path);

      news.image = result.secure_url;
      news.imageUrl = result.public_id;
    }

    // Eğer haber öne çıkarılacaksa, diğer öne çıkan haberi kaldır
    if (req.body.isFeatured === "true" && !news.isFeatured) {
      await News.updateMany({}, { isFeatured: false });
    }

    news.title = req.body.title || news.title;
    news.description = req.body.description || news.description;
    news.category = req.body.category || news.category;
    news.isFeatured = req.body.isFeatured === "true";

    await news.save();

    res.status(200).json({
      status: "success",
      news,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    // Cloudinary'den resmi sil
    await cloudinary.uploader.destroy(news.imageUrl);

    // Veritabanından haberi sil
    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Haber başarıyla silindi",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};
