const express = require("express");
const newsController = require("../controllers/newsController");
const upload = require("../middlewares/upload");
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.single("image"), newsController.createNews)
  .get(newsController.getAllNews);


router
  .route("/:id")
  .get(newsController.getNews)
  //   // .put(newsController.updateNews)
  .put(authenticateToken, upload.single("image"), newsController.updateNews)
  .delete(authenticateToken, newsController.deleteNews);
router
  .route('/related/:id')
  .get(newsController.getRelatedNews);

module.exports = router;
