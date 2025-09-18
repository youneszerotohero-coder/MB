const { getPrismaClient } = require('../config/database');
const logger = require('../utils/logger');

// Middleware to ensure database connection is available
const dbMiddleware = async (req, res, next) => {
  try {
    // Get the PrismaClient instance (this will connect if not already connected)
    const prisma = await getPrismaClient();
    
    // Attach prisma to request object for use in routes
    req.prisma = prisma;
    
    next();
  } catch (error) {
    logger.error('Database connection error in middleware:', error);
    res.status(503).json({
      error: 'Database connection failed',
      message: 'Service temporarily unavailable'
    });
  }
};

// Middleware to check database health before processing requests
const dbHealthMiddleware = async (req, res, next) => {
  try {
    const { healthCheck } = require('../config/database');
    const health = await healthCheck();
    
    if (health.status !== 'healthy') {
      logger.warn('Database health check failed:', health);
      return res.status(503).json({
        error: 'Database unhealthy',
        message: 'Service temporarily unavailable',
        health
      });
    }
    
    next();
  } catch (error) {
    logger.error('Database health check error:', error);
    res.status(503).json({
      error: 'Database health check failed',
      message: 'Service temporarily unavailable'
    });
  }
};

module.exports = {
  dbMiddleware,
  dbHealthMiddleware
};

