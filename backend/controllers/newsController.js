const News = require("../models/News");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cheerio = require("cheerio");

exports.createNews = async (req, res) => {
  console.log("Gelen request body:", req.body);
  console.log("Yüklenen dosya bilgisi:", req.file);

  try {
    let imageUrl = "";
    let description = req.body.description;

    // Eğer bir dosya yüklenmişse, Cloudinary'ye yükle
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "celikhan/events",
        resource_type: "auto",
      });

      imageUrl = result.secure_url;

      // Sunucudaki geçici dosyayı sil
      fs.unlinkSync(req.file.path);
    }

    // Base64 kodlanmış resimleri bul ve Cloudinary'ye yükle
    const base64Regex = /<img\s+[^>]*src=["'](data:image\/[^;]+;base64,([^"']+))["']/g;
    let match;
    while ((match = base64Regex.exec(description)) !== null) {
      const base64Data = match[2]; // Base64 verisi
      const mimeType = match[1].split(";")[0].split(":")[1]; // image/png veya image/jpeg gibi

      // Cloudinary'ye yükle
      const uploadResult = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64Data}`, {
        folder: "celikhan/events",
        resource_type: "image",
      });

      // Base64 verisini Cloudinary URL'si ile değiştir
      description = description.replace(match[1], uploadResult.secure_url);
    }

    // **Cheerio ile <img> etiketlerini düzenle**
    const $ = cheerio.load(description);
    $("img").each(function () {
      $(this).attr("style", "max-width:100%; height:auto; border-radius:8px; display:block; margin:1rem auto;");
    });

    // Güncellenmiş HTML'yi al
    description = $.html();

    // Veritabanına kaydet
    const news = await News.create({
      title: req.body.title,
      description: description, // Güncellenmiş HTML
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
exports.getRelatedNews = async (req, res) => {
  try {
    const currentNewsId = req.params.id;

    // Önce mevcut haberi bul
    const currentNews = await News.findById(currentNewsId);

    if (!currentNews) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    // Aynı kategorideki diğer haberleri bul, ancak mevcut haberi hariç tut
    // Sadece 3 tane getir ve createdAt'e göre sırala
    const relatedNews = await News.find({
      category: currentNews.category,
      _id: { $ne: currentNewsId } // mevcut haberi hariç tut
    })
      .sort("-createdAt")
      .limit(3);

    // Eğer yeterli sayıda benzer haber bulunamazsa, farklı kategorilerden de haber getir
    if (relatedNews.length < 3) {
      const additionalNews = await News.find({
        _id: { $ne: currentNewsId },
        category: { $ne: currentNews.category }
      })
        .sort("-createdAt")
        .limit(3 - relatedNews.length);

      // İki sonuç kümesini birleştir
      relatedNews.push(...additionalNews);
    }

    res.status(200).json({
      status: "success",
      count: relatedNews.length,
      relatedNews,
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
      if (news.imageUrl) {
        const publicId = news.imageUrl.split("/").pop().split(".")[0]; // URL’den dosya adını al
        await cloudinary.uploader.destroy(`celikhan/events/${publicId}`); // Silme işlemi
      }


      // Yeni resmi yükle
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "celikhan/events",
        resource_type: "auto",
      });

      // Geçici dosyayı sil
      fs.unlinkSync(req.file.path);

      news.imageUrl = result.secure_url;
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
    console.log("req params", req.params);
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    // Cloudinary'den resmi sil
    if (news.imageUrl) {
      const publicId = news.imageUrl.split("/").pop().split(".")[0]; // URL’den dosya adını al
      await cloudinary.uploader.destroy(`celikhan/events/${publicId}`); // Silme işlemi
    }


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
