const db = require('../database/database');

class Product {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findFeatured() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async create(productData) {
    const { name, description, imageUrl, linkUrl, featured = false } = productData;
    
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO products (name, description, imageUrl, linkUrl, featured) VALUES (?, ?, ?, ?, ?)",
        [name, description, imageUrl, linkUrl, featured ? 1 : 0],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...productData });
        }
      );
    });
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.imageUrl) {
      fields.push('imageUrl = ?');
      values.push(updates.imageUrl);
    }
    if (updates.linkUrl) {
      fields.push('linkUrl = ?');
      values.push(updates.linkUrl);
    }
    if (updates.featured !== undefined) {
      fields.push('featured = ?');
      values.push(updates.featured ? 1 : 0);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
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
      db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = Product;