// backend/controllers/carouselController.js
const Carousel = require('../models/carousel');

// Obter todos os itens do carrossel
exports.getAllCarouselItems = async (req, res) => {
  try {
    const carouselItems = await Carousel.findAll();
    res.json(carouselItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter um item do carrossel pelo ID
exports.getCarouselItemById = async (req, res) => {
  try {
    const carouselItem = await Carousel.findById(req.params.id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.json(carouselItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Criar um novo item do carrossel
exports.createCarouselItem = async (req, res) => {
  const { title, description, linkUrl } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const carouselItem = await Carousel.create({
      title,
      description,
      imageUrl,
      linkUrl
    });
    res.status(201).json(carouselItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Atualizar um item do carrossel
exports.updateCarouselItem = async (req, res) => {
  const { title, description, linkUrl, active } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let carouselItem = await Carousel.findById(req.params.id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Construir objeto de atualização
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (imageUrl) updateFields.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateFields.linkUrl = linkUrl;
    if (active !== undefined) updateFields.active = active;

    await Carousel.update(req.params.id, updateFields);
    
    // Buscar item atualizado
    carouselItem = await Carousel.findById(req.params.id);
    res.json(carouselItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Excluir um item do carrossel
exports.deleteCarouselItem = async (req, res) => {
  try {
    const carouselItem = await Carousel.findById(req.params.id);
    if (!carouselItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    await Carousel.delete(req.params.id);
    res.json({ message: 'Item removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};