const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../../database/middleware/auth');
const multer = require('multer');
const productController = require('../controllers/productController');

// Configuração do upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Rotas públicas
router.get('/', productController.getAllProducts);
router.get('/featured/:featured', productController.getProductsByFeatured);
router.get('/:id', productController.getProductById);

// Rotas protegidas
router.post('/', auth, upload.single('image'), productController.createProduct);
router.put('/:id', auth, upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;