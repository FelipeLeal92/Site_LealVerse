// config.js
module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
  DB_PATH: './backend/database/lealverse.db'
};
