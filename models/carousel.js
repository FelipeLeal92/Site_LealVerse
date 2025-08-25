// backend/models/Carousel.js
const db = require('../database/database');

class Carousel {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM carousel WHERE active = 1 ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findAllAdmin() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM carousel ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM carousel WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async create(carouselData) {
    const { title, description, imageUrl, linkUrl = '', active = true } = carouselData;
    
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO carousel (title, description, imageUrl, linkUrl, active) VALUES (?, ?, ?, ?, ?)",
        [title, description, imageUrl, linkUrl, active ? 1 : 0],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...carouselData });
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
    if (updates.description) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.imageUrl) {
      fields.push('imageUrl = ?');
      values.push(updates.imageUrl);
    }
    if (updates.linkUrl !== undefined) {
      fields.push('linkUrl = ?');
      values.push(updates.linkUrl);
    }
    if (updates.active !== undefined) {
      fields.push('active = ?');
      values.push(updates.active ? 1 : 0);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE carousel SET ${fields.join(', ')} WHERE id = ?`,
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
      db.run("DELETE FROM carousel WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = Carousel;