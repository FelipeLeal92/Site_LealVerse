// backend/routes/carousel.js
const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../../database/middleware/auth');
const multer = require('multer');
const carouselController = require('../controllers/carouselController');

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
router.get('/', carouselController.getAllCarouselItems);
router.get('/:id', carouselController.getCarouselItemById);

// Rotas protegidas
router.post('/', auth, upload.single('image'), carouselController.createCarouselItem);
router.put('/:id', auth, upload.single('image'), carouselController.updateCarouselItem);
router.delete('/:id', auth, carouselController.deleteCarouselItem);

module.exports = router;