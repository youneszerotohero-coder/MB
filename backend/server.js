console.log('Starting server initialization...');
const logger = require('./src/utils/logger');

try {
  console.log('Loading app module...');
  const app = require('./src/app');
  
  console.log('Loading database module...');
  const { connectDatabase } = require('./src/config/database');

  const PORT = process.env.PORT || 5000;

  console.log('Connecting to database...');
  // First connect to the database
  connectDatabase()
    .then(() => {
      console.log('Database connected, starting server...');
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Error during initialization:', error);
  process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});