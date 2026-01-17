const { toAbsoluteUrl } = require("../utils/filePaths");

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Lütfen bir görsel yükleyin" });
  }

  const relativeUrl = `/uploads/${req.file.filename}`;
  const imageUrl = toAbsoluteUrl(req, relativeUrl);

  res.status(201).json({
    success: true,
    imageUrl,
    relativeUrl,
  });
};
