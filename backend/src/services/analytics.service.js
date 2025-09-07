const { prisma } = require('../config/database');

async function getDashboardStats({ fromDate = null, toDate = null } = {}) {
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
}

async function salesOverTime({ period = 'daily', days = 30 } = {}) {
	// Simple implementation: group by date (daily)
	const since = new Date();
	since.setDate(since.getDate() - days);

	const rows = await prisma.$queryRaw`
		SELECT DATE("created_at") as date, COUNT(*) as orders, SUM(total) as revenue
		FROM orders
		WHERE "created_at" >= ${since}
		GROUP BY DATE("created_at")
		ORDER BY DATE("created_at") ASC
	`;

	return rows;
}

async function productProfitability({ categoryId = null, limit = 50 } = {}) {
	const where = {};
	if (categoryId) where.categoryId = categoryId;

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

	return products;
}

module.exports = { getDashboardStats, salesOverTime, productProfitability };
