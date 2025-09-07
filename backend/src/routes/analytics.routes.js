const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireDashboardAccess } = require('../middlewares/auth.middleware');

// Public endpoints may be limited; dashboard requires auth + dashboard access
router.get('/sales', authenticate, analyticsController.sales);
router.get('/products/profitability', authenticate, analyticsController.productProfit);
router.get('/dashboard', authenticate, requireDashboardAccess, analyticsController.dashboard);

module.exports = router;
