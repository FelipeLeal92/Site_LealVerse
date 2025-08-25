const bcrypt = require('bcryptjs');
const db = require('../database/database');

class User {
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async create(userData) {
    const { username, password, role = 'admin' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username, role });
        }
      );
    });
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.password) {
      fields.push('password = ?');
      values.push(await bcrypt.hash(updates.password, 10));
    }
    if (updates.role) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  static async matchPassword(user, enteredPassword) {
    return await bcrypt.compare(enteredPassword, user.password);
  }
}

module.exports = User;
