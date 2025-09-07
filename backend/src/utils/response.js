/**
 * Standard API response formatter
 */
class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static validationError(res, errors) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors,
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static forbidden(res, message = 'Access forbidden') {
    return res.status(403).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static paginated(res, data, pagination, message = 'Data fetched successfully') {
    return res.status(200).json({
      status: 'success',
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }
}

// Backwards-compatible wrapper functions used throughout controllers
function successResponse(res, message, data = null, statusCode = 200) {
  return ApiResponse.success(res, data, message, statusCode);
}

function errorResponse(res, message = 'Error occurred', statusCode = 500, errors = null) {
  return ApiResponse.error(res, message, statusCode, errors);
}

module.exports = {
  ApiResponse,
  successResponse,
  errorResponse,
};