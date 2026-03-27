const Task = require('../models/task');

const taskController = {
  async getAll(_req, res) {
    try {
      const tasks = await Task.findAll();
      res.json(tasks);
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
      const { title, description } = req.body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }
      const task = await Task.create({ title: title.trim(), description });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
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
  }
};

module.exports = taskController;
