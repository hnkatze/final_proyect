const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

beforeEach(async () => {
  await pool.query('DELETE FROM tasks');
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS tasks');
  await pool.end();
});

describe('GET /api/health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/tasks', () => {
  it('should return empty tasks with pagination', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([]);
    expect(res.body.pagination).toHaveProperty('total', 0);
  });

  it('should return all tasks with pagination', async () => {
    await pool.query(
      'INSERT INTO tasks (title, description) VALUES (\'Task 1\', \'Desc 1\'), (\'Task 2\', \'Desc 2\')'
    );
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it('should filter by completed status', async () => {
    await pool.query(
      'INSERT INTO tasks (title, completed) VALUES (\'Done\', true), (\'Pending\', false)'
    );
    const res = await request(app).get('/api/tasks?completed=true');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe('Done');
  });

  it('should search by title', async () => {
    await pool.query(
      'INSERT INTO tasks (title) VALUES (\'Learn Docker\'), (\'Buy groceries\')'
    );
    const res = await request(app).get('/api/tasks?search=docker');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe('Learn Docker');
  });

  it('should filter by priority', async () => {
    await pool.query(
      'INSERT INTO tasks (title, priority) VALUES (\'Urgent\', \'high\'), (\'Chill\', \'low\')'
    );
    const res = await request(app).get('/api/tasks?priority=high');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].priority).toBe('high');
  });
});

describe('GET /api/tasks/stats', () => {
  it('should return stats with zero tasks', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.completed).toBe(0);
    expect(res.body.pending).toBe(0);
  });

  it('should return correct stats', async () => {
    await pool.query(
      'INSERT INTO tasks (title, completed, priority) VALUES (\'A\', true, \'high\'), (\'B\', false, \'low\'), (\'C\', true, \'medium\')'
    );
    const res = await request(app).get('/api/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.completed).toBe(2);
    expect(res.body.pending).toBe(1);
    expect(res.body.high).toBe(1);
    expect(parseFloat(res.body.completion_rate)).toBeCloseTo(66.7, 0);
  });
});

describe('POST /api/tasks', () => {
  it('should create a new task with priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', description: 'A test task', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.priority).toBe('high');
    expect(res.body.completed).toBe(false);
  });

  it('should default priority to medium', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Default prio' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('medium');
  });

  it('should return 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'No title' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  it('should return 400 when title is empty string', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('should return 400 for invalid priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test', priority: 'critical' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be low, medium, or high');
  });
});

describe('POST /api/tasks/bulk', () => {
  it('should create multiple tasks with priorities', async () => {
    const res = await request(app)
      .post('/api/tasks/bulk')
      .send({ tasks: [
        { title: 'Task A', priority: 'high' },
        { title: 'Task B', priority: 'low' },
        { title: 'Task C' }
      ]});
    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].priority).toBe('high');
    expect(res.body[2].priority).toBe('medium');
  });

  it('should return 400 when tasks array is empty', async () => {
    const res = await request(app)
      .post('/api/tasks/bulk')
      .send({ tasks: [] });
    expect(res.status).toBe(400);
  });

  it('should return 400 when a task has no title', async () => {
    const res = await request(app)
      .post('/api/tasks/bulk')
      .send({ tasks: [{ title: 'Good' }, { description: 'No title' }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Each task must have a valid title');
  });
});

describe('GET /api/tasks/:id', () => {
  it('should return a task by id', async () => {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES (\'Find me\') RETURNING id'
    );
    const res = await request(app).get(`/api/tasks/${rows[0].id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find me');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/api/tasks/99999');
    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app).get('/api/tasks/abc');
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('should update a task with priority', async () => {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES (\'Old title\') RETURNING id'
    );
    const res = await request(app)
      .put(`/api/tasks/${rows[0].id}`)
      .send({ title: 'Updated', completed: true, priority: 'high' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.completed).toBe(true);
    expect(res.body.priority).toBe('high');
  });

  it('should return 404 when updating non-existent task', async () => {
    const res = await request(app)
      .put('/api/tasks/99999')
      .send({ title: 'Nope' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('should delete a task', async () => {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES (\'Delete me\') RETURNING id'
    );
    const res = await request(app).delete(`/api/tasks/${rows[0].id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  it('should return 404 when deleting non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/99999');
    expect(res.status).toBe(404);
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
