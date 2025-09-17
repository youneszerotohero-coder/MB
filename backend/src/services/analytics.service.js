const { prisma } = require('../config/database');

async function getDashboardStats({ fromDate = null, toDate = null } = {}) {
	try {
		const where = {};
		if (fromDate || toDate) where.createdAt = {};
		if (fromDate) where.createdAt.gte = new Date(fromDate);
		if (toDate) where.createdAt.lte = new Date(toDate);

		const [ordersAgg, campaignsAgg] = await Promise.all([
			prisma.order.aggregate({
				where,
				_sum: { total: true, totalCost: true, deliveryFee: true },
				_count: { id: true }
			}),
			prisma.campaign.aggregate({
				where: {},
				_sum: { cost: true }
			})
		]);

		const revenue = Number(ordersAgg._sum.total || 0);
		const totalCost = Number(ordersAgg._sum.totalCost || 0);
		const deliveryFees = Number(ordersAgg._sum.deliveryFee || 0);
		const ordersCount = ordersAgg._count.id || 0;
		const campaignSpend = Number(campaignsAgg._sum.cost || 0);
		const netProfit = Number((revenue - totalCost - campaignSpend).toFixed(2));

		return { revenue, ordersCount, campaignSpend, netProfit, deliveryFees };
	} catch (error) {
		console.error('Error in getDashboardStats:', error);
		throw error;
	}
}

async function salesOverTime({ period = 'daily', days = 30 } = {}) {
	try {
		console.log('Starting salesOverTime function...');
		
		// Simple implementation: group by date (daily)
		const since = new Date();
		since.setDate(since.getDate() - days);
		console.log('Looking for orders since:', since);

		// First, let's check if we have any orders
		const totalOrders = await prisma.order.count();
		console.log('Total orders in database:', totalOrders);
		
		if (totalOrders === 0) {
			console.log('No orders found, returning empty array');
			return [];
		}

		// Use Prisma's findMany with groupBy for better compatibility
		const orders = await prisma.order.findMany({
			where: {
				createdAt: {
					gte: since
				}
			},
			select: {
				createdAt: true,
				total: true
			},
			orderBy: {
				createdAt: 'asc'
			}
		});

		console.log('Found orders in date range:', orders.length);

		// Group by date and calculate totals
		const groupedData = {};
		orders.forEach(order => {
			const date = order.createdAt.toISOString().split('T')[0];
			if (!groupedData[date]) {
				groupedData[date] = {
					date: date,
					orders: 0,
					revenue: 0
				};
			}
			groupedData[date].orders += 1;
			groupedData[date].revenue += Number(order.total);
		});

		// Convert to array and sort by date
		const rows = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
		console.log('Processed sales data:', rows.length, 'days');

		return rows;
	} catch (error) {
		console.error('Error in salesOverTime:', error);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);
		throw error;
	}
}

async function productProfitability({ categoryId = null, limit = 50 } = {}) {
	try {
		console.log('Starting productProfitability function...');
		
		const where = {};
		if (categoryId) where.categoryId = categoryId;

		// First check if we have any products
		const totalProducts = await prisma.product.count();
		console.log('Total products in database:', totalProducts);
		
		if (totalProducts === 0) {
			console.log('No products found, returning empty array');
			return [];
		}

		const products = await prisma.product.findMany({
			where,
			orderBy: { totalRevenue: 'desc' },
			take: parseInt(limit),
			select: {
				id: true,
				name: true,
				totalRevenue: true,
				totalCost: true,
				totalProfit: true,
				profitMargin: true
			}
		});

		console.log('Found products:', products.length);
		return products;
	} catch (error) {
		console.error('Error in productProfitability:', error);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);
		throw error;
	}
}

module.exports = { getDashboardStats, salesOverTime, productProfitability };
