const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

// Public routes (no authentication required)
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);

// Protected routes (authentication required)
router.use(authenticate);

// Admin/Sub-admin routes for product management
router.post('/', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  productController.createProduct
);

router.put('/:id', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  productController.updateProduct
);

router.delete('/:id', 
  requireRole(['admin', 'sub_admin']), 
  productController.deleteProduct
);

router.patch('/:id/stock', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  productController.updateStock
);

router.patch('/:id/toggle-featured', 
  requireRole(['admin', 'sub_admin']), 
  productController.toggleFeatured
);

router.patch('/:id/toggle-active', 
  requireRole(['admin', 'sub_admin']), 
  productController.toggleActive
);

router.get('/:id/variants', 
  requireRole(['admin', 'sub_admin']), 
  productController.getProductVariants
);

router.post('/bulk-update', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest('bulkUpdate'),
  productController.bulkUpdateProducts
);

router.get('/admin/low-stock', 
  requireRole(['admin', 'sub_admin']), 
  productController.getLowStockProducts
);

module.exports = router;