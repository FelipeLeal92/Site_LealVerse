const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco
const dbPath = path.join(__dirname, 'lealverse.db');

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite');
    initDatabase();
  }
});

// Função para inicializar as tabelas
function initDatabase() {
  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de produtos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    linkUrl TEXT NOT NULL,
    featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de blog
  db.run(`CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    author TEXT DEFAULT 'Leal Verse',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de carousel
  db.run(`CREATE TABLE IF NOT EXISTS carousel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    linkUrl TEXT DEFAULT '',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Criar usuário admin padrão se não existir
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error('Erro ao verificar usuários:', err.message);
      return;
    }
    
    if (row.count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      
      db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
        ['admin', hashedPassword, 'admin'], 
        (err) => {
          if (err) {
            console.error('Erro ao criar usuário admin:', err.message);
          } else {
            console.log('Usuário admin criado com sucesso (username: admin, password: admin123)');
          }
        }
      );
    }
  });
}

module.exports = db;
