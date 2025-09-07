const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate URL-friendly slug
 */
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate unique slug with suffix if needed
 */
const generateUniqueSlug = async (text, checkFunction) => {
  let baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (await checkFunction(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Generate order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Generate SKU
 */
const generateSKU = (name, options = {}) => {
  const prefix = options.prefix || 'PRD';
  const nameSlug = generateSlug(name).replace(/-/g, '').substring(0, 6).toUpperCase();
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}-${nameSlug}-${randomSuffix}`;
};

/**
 * Calculate profit margin
 */
const calculateProfitMargin = (price, cost) => {
  if (!cost || cost === 0) return 0;
  return ((price - cost) / price) * 100;
};

/**
 * Calculate discount percentage
 */
const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice === 0) return 0;
  return ((originalPrice - salePrice) / originalPrice) * 100;
};

/**
 * Format price to decimal
 */
const formatPrice = (price) => {
  return Math.round(parseFloat(price) * 100) / 100;
};

/**
 * Parse sort parameters
 */
const parseSortParams = (sortStr) => {
  if (!sortStr) return {};

  const sortFields = sortStr.split(',');
  const orderBy = [];

  sortFields.forEach((field) => {
    const direction = field.startsWith('-') ? 'desc' : 'asc';
    const fieldName = field.replace(/^-/, '');
    
    orderBy.push({
      [fieldName]: direction,
    });
  });

  return orderBy;
};

/**
 * Parse filter parameters for products
 */
const parseProductFilters = (query) => {
  const filters = { where: {} };

  // Price range
  if (query.minPrice || query.maxPrice) {
    filters.where.price = {};
    if (query.minPrice) filters.where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) filters.where.price.lte = parseFloat(query.maxPrice);
  }

  // Category
  if (query.categoryId) {
    filters.where.categoryId = query.categoryId;
  }

  // Brand
  if (query.brand) {
    filters.where.brand = {
      contains: query.brand,
      mode: 'insensitive',
    };
  }

  // Active products only (unless admin)
  if (query.includeInactive !== 'true') {
    filters.where.isActive = true;
  }

  // Featured products
  if (query.featured === 'true') {
    filters.where.isFeatured = true;
  }

  // Colors (if product has variants)
  if (query.colors) {
    const colors = Array.isArray(query.colors) ? query.colors : [query.colors];
    filters.where.colors = {
      some: {
        name: {
          in: colors,
        },
      },
    };
  }

  // Sizes (if product has variants)
  if (query.sizes) {
    const sizes = Array.isArray(query.sizes) ? query.sizes : [query.sizes];
    filters.where.sizes = {
      some: {
        value: {
          in: sizes,
        },
      },
    };
  }

  // Search in name, description, tags
  if (query.search) {
    const searchTerm = query.search.trim();
    filters.where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        tags: {
          hasSome: [searchTerm],
        },
      },
    ];
  }

  return filters;
};

/**
 * Sanitize user input
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Generate random string
 */
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove sensitive data from user object
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Format Algerian phone number
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Algerian number
  if (cleaned.startsWith('213')) {
    return cleaned;
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '213' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    return '213' + cleaned;
  }
  
  return cleaned;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  generateOrderNumber,
  generateSKU,
  calculateProfitMargin,
  calculateDiscountPercentage,
  formatPrice,
  parseSortParams,
  parseProductFilters,
  sanitizeString,
  generateRandomString,
  deepClone,
  sanitizeUser,
  formatPhoneNumber,
};