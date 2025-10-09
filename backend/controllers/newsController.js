const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const cheerio = require("cheerio");
const News = require("../models/News");
const { toAbsoluteUrl, withAbsoluteUploads } = require("../utils/filePaths");

const uploadsDir = path.join(__dirname, "..", "uploads");
const fsPromises = fs.promises;

const ensureUploadsDir = async () => {
  await fsPromises.mkdir(uploadsDir, { recursive: true });
};

const cleanupFiles = async (filePaths = []) => {
  for (const filePath of filePaths) {
    if (!filePath) continue;

    try {
      await fsPromises.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Dosya temizliği sırasında hata:", filePath, error);
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

const saveBase64Image = async (base64Data, mimeType) => {
  await ensureUploadsDir();

  const extension =
    (mimeType && mimeType.split("/")[1]?.split("+")[0]) || "png";
  const filename = `news-${Date.now()}-${crypto
    .randomBytes(6)
    .toString("hex")}.${extension}`;
  const absolutePath = path.join(uploadsDir, filename);

  await fsPromises.writeFile(absolutePath, Buffer.from(base64Data, "base64"));

  return {
    url: `/uploads/${filename}`,
    filePath: absolutePath,
  };
};

const processDescription = async (description = "") => {
  const base64Regex =
    /<img\s+[^>]*src=["'](data:image\/[^;"']+;base64,([^"']+))["']/g;
  const matches = [...description.matchAll(base64Regex)];
  const createdFiles = [];
  let updatedDescription = description;

  for (const match of matches) {
    const [, dataUri, base64Data] = match;
    const mimeType = dataUri.split(";")[0].split(":")[1];
    const savedImage = await saveBase64Image(base64Data, mimeType);
    createdFiles.push(savedImage.filePath);
    updatedDescription = updatedDescription.replace(dataUri, savedImage.url);
  }

  const $ = cheerio.load(updatedDescription);
  $("img").each(function () {
    $(this).attr(
      "style",
      "max-width:100%; height:auto; border-radius:8px; display:block; margin:1rem auto;"
    );
  });

  const processedHtml = $.html();

  return { description: processedHtml ?? updatedDescription, createdFiles };
};

const extractLocalImagePaths = (html = "") => {
  const imageRegex = /<img[^>]*src=["'](\/uploads\/[^"']+)["']/g;
  const paths = new Set();
  let match;

  while ((match = imageRegex.exec(html)) !== null) {
    paths.add(match[1]);
  }

  return Array.from(paths);
};

const formatNewsResponse = (newsDoc, req) => {
  if (!newsDoc) return null;
  const news =
    typeof newsDoc.toObject === "function" ? newsDoc.toObject() : { ...newsDoc };

  news.imageUrl = toAbsoluteUrl(req, news.imageUrl);
  news.description = withAbsoluteUploads(req, news.description);

  return news;
};

exports.createNews = async (req, res) => {
  console.log("Gelen request body:", req.body);
  console.log("Yüklenen dosya bilgisi:", req.file);

  const tempFiles = [];

  try {
    await ensureUploadsDir();

    let imageUrl = "";
    let description = req.body.description || "";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      tempFiles.push(req.file.path);
    }

    const processed = await processDescription(description);
    description = processed.description;
    tempFiles.push(...processed.createdFiles);

    const newsDoc = await News.create({
      title: req.body.title,
      description: description,
      category: req.body.category,
      imageUrl: imageUrl,
      isFeatured: req.body.isFeatured === "true",
    });

    const news = formatNewsResponse(newsDoc, req);

    res.status(201).json({
      status: "success",
      news,
    });
  } catch (error) {
    await cleanupFiles(tempFiles);

    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const newsDocs = await News.find().sort("-createdAt");
    const featuredNewsDoc = await News.findOne({ isFeatured: true });

    const news = newsDocs.map((item) => formatNewsResponse(item, req));
    const featuredNews = formatNewsResponse(featuredNewsDoc, req);

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
    const newsDoc = await News.findById(req.params.id);

    if (!newsDoc) {
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    const news = formatNewsResponse(newsDoc, req);

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
    const newsDocs = await News.find({ category: req.params.category }).sort(
      "-createdAt"
    );
    const news = newsDocs.map((item) => formatNewsResponse(item, req));

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
    const relatedNewsDocs = await News.find({
      category: currentNews.category,
      _id: { $ne: currentNewsId } // mevcut haberi hariç tut
    })
      .sort("-createdAt")
      .limit(3);

    if (relatedNewsDocs.length < 3) {
      const additionalNews = await News.find({
        _id: { $ne: currentNewsId },
        category: { $ne: currentNews.category }
      })
        .sort("-createdAt")
        .limit(3 - relatedNewsDocs.length);
      relatedNewsDocs.push(...additionalNews);
    }

    const relatedNews = relatedNewsDocs.map((item) =>
      formatNewsResponse(item, req)
    );

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
    const featuredNewsDoc = await News.findOne({ isFeatured: true });
    const featuredNews = formatNewsResponse(featuredNewsDoc, req);

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
  const tempFiles = [];

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      await cleanupFiles(req.file ? [req.file.path] : []);
      return res.status(404).json({
        status: "fail",
        message: "Haber bulunamadı",
      });
    }

    if (req.file) {
      tempFiles.push(req.file.path);
      await deleteLocalFile(news.imageUrl);
      news.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (req.body.isFeatured === "true" && !news.isFeatured) {
      await News.updateMany({}, { isFeatured: false });
    }

    if (req.body.title) {
      news.title = req.body.title;
    }

    if (req.body.description) {
      const previousImages = extractLocalImagePaths(news.description);
      const processed = await processDescription(req.body.description);
      tempFiles.push(...processed.createdFiles);
      news.description = processed.description;

      const currentImages = extractLocalImagePaths(processed.description);
      const imagesToRemove = previousImages.filter(
        (imagePath) => !currentImages.includes(imagePath)
      );

      for (const imagePath of imagesToRemove) {
        await deleteLocalFile(imagePath);
      }
    }

    if (req.body.category) {
      news.category = req.body.category;
    }

    news.isFeatured = req.body.isFeatured === "true";

    await news.save();

    const updatedNews = formatNewsResponse(news, req);

    res.status(200).json({
      status: "success",
      news: updatedNews,
    });
  } catch (error) {
    await cleanupFiles(tempFiles);

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

    await deleteLocalFile(news.imageUrl);
    const embeddedImages = extractLocalImagePaths(news.description);
    await Promise.all(embeddedImages.map((imagePath) => deleteLocalFile(imagePath)));


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
