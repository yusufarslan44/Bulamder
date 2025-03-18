const express = require("express");
const newsController = require("../controllers/newsController");
const upload = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .post(upload.single("image"), newsController.createNews)
  .get(newsController.getAllNews);


router
  .route("/:id")
  .get(newsController.getNews)
  //   // .put(newsController.updateNews)
  .put(upload.single("image"), newsController.updateNews)
  .delete(newsController.deleteNews);
router
  .route('/related/:id')
  .get(newsController.getRelatedNews);

module.exports = router;
