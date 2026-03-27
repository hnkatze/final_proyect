const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const taskRoutes = require('./routes/tasks');
const pool = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API - Docs',
}));

// Swagger JSON spec
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verifica el estado del servidor y la conexion a la base de datos.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor y base de datos funcionando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Base de datos no disponible
 */
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database unavailable' });
  }
});

app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
