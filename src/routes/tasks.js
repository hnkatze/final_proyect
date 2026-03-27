const { Router } = require('express');
const taskController = require('../controllers/tasks');

const router = Router();

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;
