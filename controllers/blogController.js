const Blog = require('../models/blog');

// Obter todos os posts do blog
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.findAll();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter um post do blog pelo ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Criar um novo post no blog
exports.createBlogPost = async (req, res) => {
  const { title, excerpt, content, author, active } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const blogPost = await Blog.create({
      title,
      excerpt,
      content,
      imageUrl,
      author: author || 'Leal Verse',
      active: active !== 'false'
    });
    res.status(201).json(blogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Atualizar um post do blog
exports.updateBlogPost = async (req, res) => {
  const { title, excerpt, content, author, active } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Construir objeto de atualização
    const updateFields = {};
    if (title) updateFields.title = title;
    if (excerpt) updateFields.excerpt = excerpt;
    if (content) updateFields.content = content;
    if (author) updateFields.author = author;
    if (imageUrl) updateFields.imageUrl = imageUrl;
    if (active !== undefined) updateFields.active = active === 'true';

    await Blog.update(req.params.id, updateFields);
    
    // Buscar post atualizado
    blogPost = await Blog.findById(req.params.id);
    res.json(blogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Excluir um post do blog
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    await Blog.delete(req.params.id);
    res.json({ message: 'Post removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};