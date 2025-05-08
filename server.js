const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize,connectDB } = require( './src/config/database.js');
const ROUTES = require('./src/routes/index.js');
const envs = require('./src/config/envs.js');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', ROUTES);



// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 
    success: false, 
    message: err.message,
    stack: envs.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = envs.PORT || 5000;
// Sync database and start server
app.listen(PORT, async () => {
  try {
    await connectDB(); 
    console.log(`Server running in ${envs.NODE_ENV} mode on port ${PORT}`);
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;