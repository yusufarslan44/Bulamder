const express = require("express");
const upload = require("../middlewares/upload");
const uploadController = require("../controllers/uploadController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/", authenticateToken, upload.single("image"), uploadController.uploadImage);

module.exports = router;
