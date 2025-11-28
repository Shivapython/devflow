const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task CRUD routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);

// Additional task routes (must come before /:id to avoid conflicts)
router.get('/:id/history', taskController.getTaskHistory);
router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/assign', taskController.assignTask);

// Task by ID routes
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;