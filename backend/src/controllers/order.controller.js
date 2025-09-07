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

module.exports = {
	listOrders,
	createOrder,
	getOrder,
	updateStatus,
};
