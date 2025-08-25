const Product = require('../models/product');

// Obter todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ message: err.message });
  }
};

// Obter produtos por destaque
exports.getProductsByFeatured = async (req, res) => {
  try {
    const featured = req.params.featured === 'true';
    if (featured) {
      const products = await Product.findFeatured();
      res.json(products);
    } else {
      const products = await Product.findAll();
      res.json(products);
    }
  } catch (err) {
    console.error('Erro ao buscar produtos em destaque:', err);
    res.status(500).json({ message: err.message });
  }
};

// Obter um produto pelo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erro ao buscar produto por ID:', err);
    res.status(500).json({ message: err.message });
  }
};

// Criar um novo produto
exports.createProduct = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    console.log('Arquivo recebido:', req.file);
    
    const { name, description, linkUrl, featured } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    console.log('Dados processados:', { name, description, imageUrl, linkUrl, featured });

    const product = await Product.create({
      name,
      description,
      imageUrl,
      linkUrl,
      featured: featured === 'true'
    });
    
    console.log('Produto criado com sucesso:', product);
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ message: err.message });
  }
};

// Atualizar um produto
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, linkUrl, featured } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Construir objeto de atualização
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (imageUrl) updateFields.imageUrl = imageUrl;
    if (linkUrl) updateFields.linkUrl = linkUrl;
    if (featured !== undefined) updateFields.featured = featured === 'true';

    await Product.update(req.params.id, updateFields);
    
    // Buscar produto atualizado
    product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ message: err.message });
  }
};

// Excluir um produto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ message: err.message });
  }
};