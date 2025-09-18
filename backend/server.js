console.log('Starting server initialization...');
const logger = require('./src/utils/logger');

let server;

try {
  console.log('Loading app module...');
  const app = require('./src/app');
  
  console.log('Loading database module...');
  const { connectDatabase, healthCheck } = require('./src/config/database');

  const PORT = process.env.PORT || 5000;

  console.log('Connecting to database...');
  // First connect to the database
  connectDatabase()
    .then(async () => {
      console.log('Database connected, starting server...');
      
      // Perform health check
      const health = await healthCheck();
      console.log('Database health check:', health);
      
      server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        console.log(`📊 Database connection pool: healthy`);
      });

      // Add health check endpoint
      server.on('request', (req, res) => {
        if (req.url === '/health' && req.method === 'GET') {
          healthCheck().then(health => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(health));
          }).catch(() => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'unhealthy' }));
          });
        }
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
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  }
});