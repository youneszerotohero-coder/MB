const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { ApiResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { USER_ROLES } = require('../config/constants');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return ApiResponse.unauthorized(res, 'Access token is required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        canAccessDashboard: true,
      },
    });

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid token - user not found');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token has expired');
    }
    
    return ApiResponse.error(res, 'Authentication failed', 500);
  }
};

/**
 * Check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return ApiResponse.forbidden(res, 'Admin access required');
  }

  next();
};

/**
 * Check if user has admin or sub_admin role
 */
const requireStaff = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (![USER_ROLES.ADMIN, USER_ROLES.SUB_ADMIN].includes(req.user.role)) {
    return ApiResponse.forbidden(res, 'Staff access required');
  }

  next();
};

/**
 * Check if user can access dashboard
 */
const requireDashboardAccess = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (!req.user.canAccessDashboard) {
    return ApiResponse.forbidden(res, 'Dashboard access not permitted');
  }

  next();
};

/**
 * Extract JWT token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} - Extracted token or null
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(' ');
  
  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'You do not have permission to perform this action');
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  requireAdmin,
  requireStaff,
  requireDashboardAccess
};