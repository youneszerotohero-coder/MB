const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

// Admin/Sub-admin only endpoints
router.use(authenticate);
router.use(requireRole(['admin', 'sub_admin']));

router.get('/test', async (req, res) => {
	try {
		const { prisma } = require('../config/database');
		const orderCount = await prisma.order.count();
		const productCount = await prisma.product.count();
		const campaignCount = await prisma.campaign.count();
		
		res.json({
			status: 'success',
			message: 'Database connection test',
			data: {
				orders: orderCount,
				products: productCount,
				campaigns: campaignCount,
				timestamp: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error('Database test error:', error);
		res.status(500).json({
			status: 'error',
			message: 'Database connection failed',
			error: error.message
		});
	}
});

router.get('/sales', analyticsController.sales);
router.get('/products/profitability', analyticsController.productProfit);
router.get('/dashboard', analyticsController.dashboard);

module.exports = router;
