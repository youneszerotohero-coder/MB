const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

// Admin/Sub-admin only endpoints
router.use(authenticate);
router.use(requireRole(['admin', 'sub_admin']));

router.get('/sales', analyticsController.sales);
router.get('/products/profitability', analyticsController.productProfit);
router.get('/dashboard', analyticsController.dashboard);

module.exports = router;
