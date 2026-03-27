const Task = require('../models/task');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

const taskController = {
  async getAll(req, res) {
    try {
      const { completed, search, priority, page, limit } = req.query;
      const filters = {};
      if (completed !== undefined) filters.completed = completed === 'true';
      if (search) filters.search = search;
      if (priority && VALID_PRIORITIES.includes(priority)) filters.priority = priority;
      if (page) filters.page = parseInt(page) || 1;
      if (limit) filters.limit = Math.min(parseInt(limit) || 20, 100);
      const result = await Task.findAll(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  },

  async create(req, res) {
    try {
      const { title, description, priority } = req.body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (priority && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
      }
      const task = await Task.create({ title: title.trim(), description, priority });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  async createBulk(req, res) {
    try {
      const { tasks } = req.body;
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: 'Tasks array is required and must not be empty' });
      }
      for (const task of tasks) {
        if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
          return res.status(400).json({ error: 'Each task must have a valid title' });
        }
        if (task.priority && !VALID_PRIORITIES.includes(task.priority)) {
          return res.status(400).json({ error: 'Priority must be low, medium, or high' });
        }
      }
      const sanitized = tasks.map(t => ({
        title: t.title.trim(),
        description: t.description,
        priority: t.priority
      }));
      const created = await Task.createBulk(sanitized);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tasks' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }
      if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
      }
      const task = await Task.update(id, req.body);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }
      const task = await Task.delete(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', task });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  async getStats(_req, res) {
    try {
      const stats = await Task.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
};

module.exports = taskController;
