const { PAGINATION } = require('../config/constants');

/**
 * Parse pagination parameters from request
 */
const parsePagination = (req) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    skip: Math.max(0, skip),
  };
};

/**
 * Calculate pagination metadata
 */
const calculatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Generate Prisma pagination parameters
 */
const getPrismaPageination = (req) => {
  const { skip, limit } = parsePagination(req);
  return { skip, take: limit };
};

module.exports = {
  parsePagination,
  calculatePagination,
  getPrismaPageination,
};