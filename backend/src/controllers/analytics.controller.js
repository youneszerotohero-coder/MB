const analyticsService = require('../services/analytics.service');
const { successResponse, errorResponse } = require('../utils/response');

async function dashboard(req, res) {
	try {
		const { fromDate, toDate } = req.query;
		console.log('Dashboard request params:', { fromDate, toDate });
		
		// Check database connection first
		const { prisma } = require('../config/database');
		
		// Test database connection
		await prisma.$queryRaw`SELECT 1`;
		
		// Check if we have any data
		const [orderCount, productCount, campaignCount] = await Promise.all([
			prisma.order.count(),
			prisma.product.count(),
			prisma.campaign.count()
		]);
		console.log('Database counts - Orders:', orderCount, 'Products:', productCount, 'Campaigns:', campaignCount);
		
		const stats = await analyticsService.getDashboardStats({ fromDate, toDate });
		console.log('Dashboard stats retrieved:', stats);
		return successResponse(res, 'Dashboard stats retrieved', stats);
	} catch (error) {
		console.error('Analytics dashboard error:', error);
		console.error('Error details:', error.message);
		console.error('Error stack:', error.stack);
		
		// Check if it's a database connection error
		if (error.code === 'P1001' || error.message.includes('Can\'t reach database server')) {
			return errorResponse(res, 'Database connection failed. Please check your database configuration.', 503);
		}
		
		return errorResponse(res, 'Failed to retrieve analytics', 500);
	}
}

async function sales(req, res) {
	try {
		const { period = 'daily', days = 30 } = req.query;
		console.log('Sales request params:', { period, days });
		
		// Check database connection first
		const { prisma } = require('../config/database');
		await prisma.$queryRaw`SELECT 1`;
		
		// First, let's check if we have any orders at all
		const orderCount = await prisma.order.count();
		console.log('Total orders in database:', orderCount);
		
		if (orderCount === 0) {
			console.log('No orders found, returning empty array');
			return successResponse(res, 'Sales over time retrieved', []);
		}
		
		const rows = await analyticsService.salesOverTime({ period, days: parseInt(days) });
		console.log('Sales data retrieved:', rows.length, 'records');
		return successResponse(res, 'Sales over time retrieved', rows);
	} catch (error) {
		console.error('Sales over time error:', error);
		console.error('Error details:', error.message);
		console.error('Error stack:', error.stack);
		
		// Check if it's a database connection error
		if (error.code === 'P1001' || error.message.includes('Can\'t reach database server')) {
			return errorResponse(res, 'Database connection failed. Please check your database configuration.', 503);
		}
		
		return errorResponse(res, 'Failed to retrieve sales data', 500);
	}
}

async function productProfit(req, res) {
	try {
		const { categoryId, limit = 50 } = req.query;
		
		// Check database connection first
		const { prisma } = require('../config/database');
		await prisma.$queryRaw`SELECT 1`;
		
		const rows = await analyticsService.productProfitability({ categoryId, limit: parseInt(limit) });
		return successResponse(res, 'Product profitability retrieved', rows);
	} catch (error) {
		console.error('Product profitability error:', error);
		console.error('Error details:', error.message);
		console.error('Error stack:', error.stack);
		
		// Check if it's a database connection error
		if (error.code === 'P1001' || error.message.includes('Can\'t reach database server')) {
			return errorResponse(res, 'Database connection failed. Please check your database configuration.', 503);
		}
		
		return errorResponse(res, 'Failed to retrieve product profitability', 500);
	}
}

module.exports = { dashboard, sales, productProfit };
