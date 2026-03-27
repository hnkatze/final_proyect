const pool = require('../config/database');

const Task = {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ title, description }) {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || null]
    );
    return result.rows[0];
  },

  async update(id, { title, description, completed }) {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [title, description, completed, id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }
};

module.exports = Task;
