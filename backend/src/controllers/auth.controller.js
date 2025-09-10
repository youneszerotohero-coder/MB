const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const { user, token } = await authService.login({ email, password });

    return successResponse(res, 'Login successful', { user, token });
  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, error.message || 'Login failed', 401);
  }
};

const me = async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const user = await authService.getUserById(req.user.id);
    return successResponse(res, 'User data retrieved successfully', user);
  } catch (error) {
    logger.error('Get user data error:', error);
    return errorResponse(res, error.message || 'Failed to get user data', 500);
  }
};

module.exports = { login, me };
