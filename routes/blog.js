const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../../database/middleware/auth');
const multer = require('multer');
const blogController = require('../controllers/blogController');

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
router.get('/', blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostById);

// Rotas protegidas
router.post('/', auth, upload.single('image'), blogController.createBlogPost);
router.put('/:id', auth, upload.single('image'), blogController.updateBlogPost);
router.delete('/:id', auth, blogController.deleteBlogPost);

module.exports = router;