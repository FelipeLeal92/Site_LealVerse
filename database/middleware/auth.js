const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = function(req, res, next) {
  console.log('Middleware de autenticação executado');
  console.log('Headers:', req.headers);
  
  // Obter token do header
  const token = req.header('x-auth-token');
  console.log('Token recebido:', token);
  
  // Verificar se não há token
  if (!token) {
    console.log('Token não encontrado');
    return res.status(401).json({ message: 'Acesso negado' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(401).json({ message: 'Token inválido' });
  }
};