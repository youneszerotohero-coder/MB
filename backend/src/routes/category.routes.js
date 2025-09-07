const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

// Public routes (no authentication required)
router.get('/tree', categoryController.getCategoryTree);
router.get('/with-product-count', categoryController.getCategoriesWithProductCount);
router.get('/:id/breadcrumbs', categoryController.getCategoryBreadcrumbs);
router.get('/:id', categoryController.getCategory);
router.get('/', categoryController.getCategories);

// Protected routes (authentication required)
router.use(authenticate);

// Admin/Sub-admin routes for category management
router.post('/', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  categoryController.createCategory
);

router.put('/:id', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  categoryController.updateCategory
);

router.delete('/:id', 
  requireRole(['admin', 'sub_admin']), 
  categoryController.deleteCategory
);

router.patch('/:id/toggle-active', 
  requireRole(['admin', 'sub_admin']), 
  categoryController.toggleActive
);

router.post('/reorder', 
  requireRole(['admin', 'sub_admin']), 
  validateRequest({}),
  categoryController.reorderCategories
);

module.exports = router;