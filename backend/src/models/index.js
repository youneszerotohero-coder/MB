// Use the singleton PrismaClient instance from database config
const { getPrismaClient } = require('../config/database');

// Export a function that returns the PrismaClient instance
module.exports = getPrismaClient;
