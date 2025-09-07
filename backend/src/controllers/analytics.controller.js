const analyticsService = require('../services/analytics.service');
const { successResponse, errorResponse } = require('../utils/response');

async function dashboard(req, res) {
	try {
		const { fromDate, toDate } = req.query;
		const stats = await analyticsService.getDashboardStats({ fromDate, toDate });
		return successResponse(res, 'Dashboard stats retrieved', stats);
	} catch (error) {
		console.error('Analytics dashboard error:', error);
		return errorResponse(res, 'Failed to retrieve analytics', 500);
	}
}

async function sales(req, res) {
	try {
		const { period = 'daily', days = 30 } = req.query;
		const rows = await analyticsService.salesOverTime({ period, days: parseInt(days) });
		return successResponse(res, 'Sales over time retrieved', rows);
	} catch (error) {
		console.error('Sales over time error:', error);
		return errorResponse(res, 'Failed to retrieve sales data', 500);
	}
}

async function productProfit(req, res) {
	try {
		const { categoryId, limit = 50 } = req.query;
		const rows = await analyticsService.productProfitability({ categoryId, limit: parseInt(limit) });
		return successResponse(res, 'Product profitability retrieved', rows);
	} catch (error) {
		console.error('Product profitability error:', error);
		return errorResponse(res, 'Failed to retrieve product profitability', 500);
	}
}

module.exports = { dashboard, sales, productProfit };
