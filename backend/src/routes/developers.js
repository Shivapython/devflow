const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');

// Developer CRUD routes
router.get('/', developerController.getAllDevelopers);
router.post('/', developerController.createDeveloper);

// Additional developer routes (must come before /:id to avoid conflicts)
router.get('/:id/stats', developerController.getDeveloperStats);
router.get('/:id/tasks', developerController.getDeveloperTasks);

// Developer by ID routes
router.get('/:id', developerController.getDeveloperById);
router.put('/:id', developerController.updateDeveloper);
router.delete('/:id', developerController.deleteDeveloper);

module.exports = router;