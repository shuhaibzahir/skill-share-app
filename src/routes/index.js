const routes = require('express').Router();
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const skillRoutes = require('./skill.routes');
const offerRoutes = require('./offer.routes');
const { protect, authorize } = require('../middlewares/auth');

// Auth routes
routes.use('/auth', authRoutes);

// User routes
routes.use('/tasks',protect, taskRoutes);
routes.use('/skills', protect,skillRoutes);
routes.use('/offers',protect, offerRoutes);

module.exports = routes;