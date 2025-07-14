const express = require('express');
const router = express.Router();
const pageContentController = require('../controllers/pageContentController');
const authenticateToken = require('../middlewares/authenticateToken');

// Herkese açık rotalar
router.get('/', pageContentController.getAllPageContents);
router.get('/:pageName', pageContentController.getPageContentByName);

// Sadece admin erişimli rotalar
router.post('/', authenticateToken, pageContentController.createPageContent);
router.put('/:pageName', authenticateToken, pageContentController.updatePageContent);
router.delete('/:pageName', authenticateToken, pageContentController.deletePageContent);

module.exports = router; 