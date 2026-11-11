const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/login_auth');
const upload = require('../configs/multer');
const createProductController = require('../controllers/addProductsController');

// multer parses FormData, saves images to public/temp, populates req.files
router.post('/products', authMiddleware, upload.array('images', 4), createProductController);

module.exports = router;
