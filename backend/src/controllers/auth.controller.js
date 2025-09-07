const authService = require('../services/auth.service');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    const { user, token } = await authService.login({ email, password });

    return ApiResponse.success(res, { user, token }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    return ApiResponse.unauthorized(res, error.message);
  }
};

module.exports = { login };
