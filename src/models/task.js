const pool = require('../config/database');

const Task = {
  async findAll({ completed, search, priority, page = 1, limit = 20 } = {}) {
    const conditions = [];
    const params = [];
    let idx = 1;

    if (completed !== undefined) {
      conditions.push(`completed = $${idx++}`);
      params.push(completed);
    }
    if (search) {
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (priority) {
      conditions.push(`priority = $${idx++}`);
      params.push(priority);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks ${where}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM tasks ${where} ORDER BY
        CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
        created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return {
      tasks: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ title, description, priority }) {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
      [title, description || null, priority || 'medium']
    );
    return result.rows[0];
  },

  async update(id, { title, description, completed, priority }) {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           priority = COALESCE($4, priority),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, completed, priority, id]
    );
    return result.rows[0] || null;
  },

  async createBulk(tasks) {
    const values = tasks.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ');
    const params = tasks.flatMap(t => [t.title, t.description || null, t.priority || 'medium']);
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority) VALUES ${values} RETURNING *`,
      params
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  async getStats() {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE completed = true)::int AS completed,
        COUNT(*) FILTER (WHERE completed = false)::int AS pending,
        COUNT(*) FILTER (WHERE priority = 'high')::int AS high,
        COUNT(*) FILTER (WHERE priority = 'medium')::int AS medium,
        COUNT(*) FILTER (WHERE priority = 'low')::int AS low,
        CASE WHEN COUNT(*) > 0
          THEN ROUND(COUNT(*) FILTER (WHERE completed = true)::numeric / COUNT(*)::numeric * 100, 1)
          ELSE 0
        END AS completion_rate
      FROM tasks
    `);
    return result.rows[0];
  }
};

module.exports = Task;
