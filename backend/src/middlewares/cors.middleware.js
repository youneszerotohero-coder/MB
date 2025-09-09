const cors = require('cors');

// Configure CORS using environment variable BACKEND_ALLOWED_ORIGINS.
// In development (NODE_ENV=development) allow all origins for convenience.
const allowedOrigins = (process.env.BACKEND_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Allow everything in development for convenience
    return cors({ origin: '*' })(req, res, next);
  }

  // If no allowed origins configured, deny cross-origin by default
  if (allowedOrigins.length === 0) {
    return cors({ origin: false })(req, res, next);
  }

  return cors({
    origin: function(origin, callback) {
      // Allow same-origin or matching allowedOrigins
      if (!origin) return callback(null, true); // server-to-server or same-origin
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
  })(req, res, next);
};
