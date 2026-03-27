const { Router } = require('express');
const taskController = require('../controllers/tasks');

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar todas las tareas
 *     description: Retorna un array con todas las tareas ordenadas por fecha de creacion descendente.
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', taskController.getAll);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener tarea por ID
 *     description: Retorna una tarea especifica segun su ID.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *         example: 1
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid task ID"
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 */
router.get('/:id', taskController.getById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear nueva tarea
 *     description: Crea una nueva tarea con titulo obligatorio y descripcion opcional.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos invalidos (titulo requerido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Title is required"
 *       500:
 *         description: Error del servidor
 */
router.post('/', taskController.create);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar tarea
 *     description: Actualiza los campos de una tarea existente. Solo se actualizan los campos enviados.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', taskController.update);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar tarea
 *     description: Elimina una tarea existente y retorna la tarea eliminada.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: ID invalido
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', taskController.delete);

module.exports = router;
