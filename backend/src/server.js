require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const developerRoutes = require('./routes/developers');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'DevFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/developers', developerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 DevFlow API Server Started       ║
║   Port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
║   Database: SQLite                     ║
╚════════════════════════════════════════╝
  `);
  console.log('📍 API Endpoints:');
  console.log('   GET  /health');
  console.log('   GET  /api/developers');
  console.log('   GET  /api/tasks');
  console.log('   GET  /api/analytics/team');
  console.log('   GET  /api/analytics/velocity');
  console.log('   GET  /api/analytics/bottlenecks');
  console.log('   GET  /api/analytics/leaderboard');
  console.log('');
});