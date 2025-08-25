const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const isMatch = await User.matchPassword(user, password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    
    // Criar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar novo usuário (apenas para desenvolvimento)
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    
    // Criar novo usuário
    const user = await User.create({ username, password, role });
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;