// database/init.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/user');
const Carousel = require('../backend/models/carousel');
const Product = require('../backend/models/product');
const Blog = require('../backend/models/blog');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/lealverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Criar usuário administrador
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Usuário admin já existe');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Usuário admin criado com sucesso');
  } catch (err) {
    console.error('Erro ao criar usuário admin:', err);
  }
};

// Criar dados iniciais do carrossel
const createCarouselData = async () => {
  try {
    const count = await Carousel.countDocuments();
    if (count > 0) {
      console.log('Dados do carrossel já existem');
      return;
    }

    const carouselItems = [
      {
        title: 'Soluções em Automação',
        description: 'Automatize seus processos e aumente a produtividade da sua empresa.',
        imageUrl: '/uploads/carousel-1.jpg',
        linkUrl: '/solutions.html#automation',
        active: true,
      },
      {
        title: 'Sistemas Personalizados',
        description: 'Desenvolvemos sistemas sob medida para atender às necessidades do seu negócio.',
        imageUrl: '/uploads/carousel-2.jpg',
        linkUrl: '/solutions.html#custom-systems',
        active: true,
      },
      {
        title: 'Web Pages Profissionais',
        description: 'Crie uma presença online forte com nossos sites e landing pages.',
        imageUrl: '/uploads/carousel-3.jpg',
        linkUrl: '/solutions.html#web-pages',
        active: true,
      },
    ];

    await Carousel.insertMany(carouselItems);
    console.log('Dados do carrossel criados com sucesso');
  } catch (err) {
    console.error('Erro ao criar dados do carrossel:', err);
  }
};

// Criar dados iniciais de produtos
const createProductsData = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Dados de produtos já existem');
      return;
    }

    const products = [
      {
        name: 'Gestão Empresarial',
        description: 'Sistema completo para gestão de pequenas e médias empresas, com módulos financeiros, de vendas e estoque.',
        imageUrl: '/uploads/product-1.jpg',
        linkUrl: 'https://example.com/product1',
        featured: true,
      },
      {
        name: 'CRM para Vendas',
        description: 'Ferramenta para gerenciar relacionamento com clientes e acompanhar o pipeline de vendas.',
        imageUrl: '/uploads/product-2.jpg',
        linkUrl: 'https://example.com/product2',
        featured: true,
      },
      {
        name: 'Controle Financeiro',
        description: 'Sistema para controle financeiro, com emissão de relatórios e gráficos de desempenho.',
        imageUrl: '/uploads/product-3.jpg',
        linkUrl: 'https://example.com/product3',
        featured: false,
      },
    ];

    await Product.insertMany(products);
    console.log('Dados de produtos criados com sucesso');
  } catch (err) {
    console.error('Erro ao criar dados de produtos:', err);
  }
};

// Criar dados iniciais do blog
const createBlogData = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count > 0) {
      console.log('Dados do blog já existem');
      return;
    }

    const blogPosts = [
      {
        title: '5 Benefícios da Automação para Pequenas Empresas',
        excerpt: 'Descubra como a automação pode transformar sua pequena empresa, aumentando a eficiência e reduzindo custos.',
        content: '<p>A automação de processos é uma das tecnologias mais impactantes para pequenas empresas nos últimos anos...</p>',
        imageUrl: '/uploads/blog-1.jpg',
        author: 'Leal Verse',
        active: true,
      },
      {
        title: 'Como Escolher o Sistema de Gestão Ideal para seu Negócio',
        excerpt: 'Um guia completo para selecionar o sistema de gestão que melhor atende às necessidades da sua empresa.',
        content: '<p>Escolher o sistema de gestão certo para sua empresa é uma decisão crítica...</p>',
        imageUrl: '/uploads/blog-2.jpg',
        author: 'Leal Verse',
        active: true,
      },
    ];

    await Blog.insertMany(blogPosts);
    console.log('Dados do blog criados com sucesso');
  } catch (err) {
    console.error('Erro ao criar dados do blog:', err);
  }
};

// Inicializar o banco de dados
const initDatabase = async () => {
  await createAdminUser();
  await createCarouselData();
  await createProductsData();
  await createBlogData();
  
  console.log('Banco de dados inicializado com sucesso');
  mongoose.connection.close();
};

initDatabase();