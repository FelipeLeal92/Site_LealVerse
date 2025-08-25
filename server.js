// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config');

// Importar configuração do banco SQLite
const db = require('./database/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir arquivos estáticos da pasta raiz
app.use(express.static(path.join(__dirname, '..')));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/carousel', require('./routes/carousel'));
app.use('/api/products', require('./routes/products'));
app.use('/api/blog', require('./routes/blog'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Rota para o painel admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
});

// Rota para o dashboard admin
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'dashboard.html'));
});

// Iniciar servidor
app.listen(config.PORT, () => console.log(`Servidor rodando na porta ${config.PORT}`));