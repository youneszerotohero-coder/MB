const orderService = require('../services/order.service');
const { successResponse, errorResponse } = require('../utils/response');
const { validateOrderData } = require('../utils/validators');

async function listOrders(req, res) {
	try {
		const options = {
			page: parseInt(req.query.page) || 1,
			limit: parseInt(req.query.limit) || 20,
			status: req.query.status,
			paymentStatus: req.query.paymentStatus,
			fromDate: req.query.fromDate,
			toDate: req.query.toDate,
			search: req.query.search,
		};

		const result = await orderService.getOrders(options);
		return successResponse(res, 'Orders retrieved successfully', result);
	} catch (error) {
		console.error('Error listing orders:', error);
		return errorResponse(res, 'Failed to retrieve orders', 500);
	}
}

async function createOrder(req, res) {
	try {
		const validation = validateOrderData(req.body);
		if (!validation.isValid) {
			return errorResponse(res, 'Validation error', 400, validation.errors);
		}

		// Attach createdById if authenticated
		if (req.user) req.body.createdById = req.user.id;

		// Calculate delivery fee based on wilaya/baladiya if not provided
		// You can implement your own logic here to calculate delivery fee
		// For example:
		if (!req.body.deliveryFee && req.body.customerWilaya) {
			req.body.deliveryFee = calculateDeliveryFee(req.body.customerWilaya, req.body.customerBaladiya);
		}

		const order = await orderService.createOrder(req.body);
		return successResponse(res, 'Order created successfully', order, 201);
	} catch (error) {
		console.error('Error creating order:', error);
		return errorResponse(res, error.message || 'Failed to create order', 400);
	}
}

async function getOrder(req, res) {
	try {
		const { id } = req.params;
		const order = await orderService.getOrderById(id);
		if (!order) return errorResponse(res, 'Order not found', 404);
		return successResponse(res, 'Order retrieved successfully', order);
	} catch (error) {
		console.error('Error getting order:', error);
		return errorResponse(res, 'Failed to retrieve order', 500);
	}
}

async function updateStatus(req, res) {
	try {
		const { id } = req.params;
		const { status } = req.body;
		if (!status) return errorResponse(res, 'Status is required', 400);

		const updated = await orderService.updateOrderStatus(id, status);
		return successResponse(res, 'Order status updated', updated);
	} catch (error) {
		console.error('Error updating order status:', error);
		return errorResponse(res, error.message || 'Failed to update order status', 400);
	}
}

/**
 * Helper function to calculate delivery fee based on wilaya and baladiya
 * You can customize this logic based on your business requirements
 */
function calculateDeliveryFee(wilaya, baladiya) {
	// Example delivery fee logic
	const deliveryFees = {
		'Alger': 500,
		'Oran': 600,
		'Constantine': 650,
		'Blida': 400,
		// Add more wilayas as needed
	};

	// You can also have special rates for specific baladiya
	const specialRates = {
		'Alger_Centre': 300,
		'Blida_Centre': 350,
		// Add more special rates as needed
	};

	// Check for special rate first
	const specialKey = `${wilaya}_${baladiya}`;
	if (baladiya && specialRates[specialKey]) {
		return specialRates[specialKey];
	}

	// Return wilaya rate or default
	return deliveryFees[wilaya] || 700; // Default fee if wilaya not found
}

module.exports = {
	listOrders,
	createOrder,
	getOrder,
	updateStatus,
};