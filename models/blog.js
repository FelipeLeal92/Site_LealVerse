const db = require('../database/database');

class Blog {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM blog WHERE active = 1 ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findAllAdmin() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM blog ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM blog WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async create(blogData) {
    const { title, excerpt, content, imageUrl, author = 'Leal Verse', active = true } = blogData;
    
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO blog (title, excerpt, content, imageUrl, author, active) VALUES (?, ?, ?, ?, ?, ?)",
        [title, excerpt, content, imageUrl, author, active ? 1 : 0],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...blogData });
        }
      );
    });
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.title) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.excerpt) {
      fields.push('excerpt = ?');
      values.push(updates.excerpt);
    }
    if (updates.content) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.imageUrl) {
      fields.push('imageUrl = ?');
      values.push(updates.imageUrl);
    }
    if (updates.author) {
      fields.push('author = ?');
      values.push(updates.author);
    }
    if (updates.active !== undefined) {
      fields.push('active = ?');
      values.push(updates.active ? 1 : 0);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE blog SET ${fields.join(', ')} WHERE id = ?`,
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
      db.run("DELETE FROM blog WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = Blog;