const { Router } = require('express');
const taskController = require('../controllers/tasks');

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar tareas con filtros y paginacion
 *     description: Retorna tareas filtradas por estado, prioridad o busqueda, con paginacion.
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado (true/false)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar en titulo y descripcion
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero de pagina
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Tareas por pagina (max 100)
 *     responses:
 *       200:
 *         description: Lista paginada de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', taskController.getAll);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Estadisticas de tareas
 *     description: Retorna contadores y porcentaje de completado agrupados por estado y prioridad.
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Estadisticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 */
router.get('/stats', taskController.getStats);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener tarea por ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', taskController.getById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada
 *       400:
 *         description: Datos invalidos
 */
router.post('/', taskController.create);

/**
 * @swagger
 * /tasks/bulk:
 *   post:
 *     summary: Crear multiples tareas
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tasks]
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TaskInput'
 *           example:
 *             tasks:
 *               - title: "Tarea 1"
 *                 description: "Primera tarea"
 *                 priority: "high"
 *               - title: "Tarea 2"
 *                 priority: "low"
 *     responses:
 *       201:
 *         description: Tareas creadas
 *       400:
 *         description: Datos invalidos
 */
router.post('/bulk', taskController.createBulk);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/:id', taskController.update);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', taskController.delete);

module.exports = router;
