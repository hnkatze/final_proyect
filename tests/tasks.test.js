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
  it('should return an empty array when no tasks exist', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all tasks', async () => {
    await pool.query(
      'INSERT INTO tasks (title, description) VALUES (\'Task 1\', \'Desc 1\'), (\'Task 2\', \'Desc 2\')'
    );
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /api/tasks', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', description: 'A test task' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.description).toBe('A test task');
    expect(res.body.completed).toBe(false);
    expect(res.body).toHaveProperty('id');
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
    expect(res.body.error).toBe('Title is required');
  });
});

describe('POST /api/tasks/bulk', () => {
  it('should create multiple tasks', async () => {
    const res = await request(app)
      .post('/api/tasks/bulk')
      .send({ tasks: [
        { title: 'Task A', description: 'First' },
        { title: 'Task B' },
        { title: 'Task C', description: 'Third' }
      ]});
    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].title).toBe('Task A');
    expect(res.body[1].title).toBe('Task B');
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
    expect(res.body.error).toBe('Task not found');
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app).get('/api/tasks/abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid task ID');
  });
});

describe('PUT /api/tasks/:id', () => {
  it('should update a task', async () => {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES (\'Old title\') RETURNING id'
    );
    const res = await request(app)
      .put(`/api/tasks/${rows[0].id}`)
      .send({ title: 'Updated title', completed: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
    expect(res.body.completed).toBe(true);
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
    expect(res.body.task.title).toBe('Delete me');
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
