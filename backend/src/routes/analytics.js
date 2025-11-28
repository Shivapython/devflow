const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics routes
router.get('/team', analyticsController.getTeamMetrics);
router.get('/velocity', analyticsController.getVelocityData);
router.get('/bottlenecks', analyticsController.getBottlenecks);
router.get('/leaderboard', analyticsController.getLeaderboard);
router.get('/distribution', analyticsController.getTaskDistribution);

module.exports = router;