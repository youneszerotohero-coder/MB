module.exports = {
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    SUB_ADMIN: 'sub_admin',
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Order Source
  ORDER_SOURCE: {
    WEBSITE: 'website',
    POS: 'pos',
    PHONE: 'phone',
  },

  // Size Types
  SIZE_TYPES: {
    LETTER: 'letter',
    NUMERIC: 'numeric',
    CUSTOM: 'custom',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,webp').split(','),
    CLOUDINARY_FOLDER: 'ecommerce',
  },

  // Cache Duration (in seconds)
  CACHE: {
    PRODUCTS: 300, // 5 minutes
    CATEGORIES: 600, // 10 minutes
    ANALYTICS: 1800, // 30 minutes
  },

  // Search
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_SUGGESTIONS: 10,
  },

  // Analytics
  ANALYTICS: {
    PERIOD_TYPES: {
      DAILY: 'daily',
      WEEKLY: 'weekly',
      MONTHLY: 'monthly',
    },
  },

  // Error Messages
  ERRORS: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
  },

  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Data fetched successfully',
  },
};