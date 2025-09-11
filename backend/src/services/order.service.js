const { prisma } = require('../config/database');
const { ORDER_STATUS, PAYMENT_STATUS, ORDER_SOURCE } = require('../config/constants');

/**
 * Create a new order (checkout)
 * Expects: { customerName, customerPhone, customerWilaya, customerBaladiya, customerAddress, customerEmail, items: [{ productId, variantId, quantity }], deliveryFee, orderSource, createdById, notes }
 */
async function createOrder(payload) {
	const {
		customerName,
		customerPhone,
		customerWilaya,
		customerBaladiya,
		customerAddress,
		customerEmail,
		items,
		deliveryFee = 0, // Now passed directly from client
		orderSource = ORDER_SOURCE.WEBSITE,
		createdById = null,
		notes = null,
		// Explicitly ignore payment_method and other unused fields
		...unusedFields
	} = payload;

	if (!items || !Array.isArray(items) || items.length === 0) {
		throw new Error('Cart items are required to create an order');
	}

	return await prisma.$transaction(async (tx) => {
		let subtotal = 0;
		let totalCost = 0;
		const lineItems = [];

		// Validate items and compute totals
		for (const it of items) {
			const quantity = parseInt(it.quantity, 10) || 0;
			if (quantity <= 0) throw new Error('Invalid item quantity');

			let product = null;
			let variant = null;
			let unitPrice = 0;
			let unitCost = 0;

			if (it.variantId) {
				variant = await tx.productVariant.findUnique({
					where: { id: it.variantId },
					include: { 
						product: true,
						color: true,
						size: true
					}
				});
				if (!variant) throw new Error('Product variant not found');
				product = variant.product;
				unitPrice = Number(variant.price);
				unitCost = Number(variant.cost ?? product.cost ?? 0);

				if (variant.stockQuantity < quantity) throw new Error(`Insufficient stock for variant ${variant.id}`);
			} else {
				product = await tx.product.findUnique({ where: { id: it.productId } });
				if (!product) throw new Error('Product not found');
				unitPrice = Number(product.price);
				unitCost = Number(product.cost ?? 0);

				if (product.stockQuantity < quantity) throw new Error(`Insufficient stock for product ${product.id}`);
			}

			const lineTotal = Number((unitPrice * quantity).toFixed(2));
			const lineCost = Number((unitCost * quantity).toFixed(2));
			const lineProfit = Number((lineTotal - lineCost).toFixed(2));

			subtotal = Number((subtotal + lineTotal).toFixed(2));
			totalCost = Number((totalCost + lineCost).toFixed(2));

			lineItems.push({
				productId: product.id,
				variantId: variant ? variant.id : null,
				productName: product.name,
				productSku: variant?.skuVariant || product.sku || null,
				selectedColor: variant?.color ? variant.color.name : null,
				selectedSize: variant?.size ? variant.size.value : null,
				quantity,
				unitPrice,
				unitCost,
				lineTotal,
				lineCost,
				lineProfit,
			});
		}

		const discountAmount = 0;
		const total = Number((subtotal + Number(deliveryFee) - discountAmount).toFixed(2));
		const totalProfit = Number((total - totalCost - Number(deliveryFee)).toFixed(2)); // Subtract delivery fee from profit

		// Generate a simple order number
		const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

		// Create order
		const order = await tx.order.create({
			data: {
				orderNumber,
				customerName,
				customerPhone,
				customerWilaya,
				customerBaladiya,
				customerAddress,
				customerEmail,
				subtotal,
				deliveryFee: Number(deliveryFee),
				discountAmount,
				total,
				totalCost,
				totalProfit,
				status: ORDER_STATUS.PENDING,
				paymentStatus: PAYMENT_STATUS.PENDING,
				orderSource,
				createdById,
				notes,
			},
		});

		// Create order items and update stock / metrics
		for (const li of lineItems) {
			await tx.orderItem.create({
				data: {
					orderId: order.id,
					productId: li.productId,
					variantId: li.variantId,
					productName: li.productName,
					productSku: li.productSku,
					selectedColor: li.selectedColor,
					selectedSize: li.selectedSize,
					quantity: li.quantity,
					unitPrice: li.unitPrice,
					unitCost: li.unitCost,
					lineTotal: li.lineTotal,
					lineProfit: li.lineProfit,
				}
			});

			// Update stock and sold count
			if (li.variantId) {
				await tx.productVariant.update({
					where: { id: li.variantId },
					data: {
						stockQuantity: { decrement: li.quantity },
						soldCount: { increment: li.quantity },
						revenue: { increment: li.lineTotal }
					}
				});
			}

			// Always update the main product metrics
			const updateData = {
				soldCount: { increment: li.quantity },
				totalRevenue: { increment: li.lineTotal }
			};

			// Only update stock if it's not a variant (variants handle their own stock)
			if (!li.variantId) {
				updateData.stockQuantity = { decrement: li.quantity };
			}

			// Only update cost and profit if values are defined
			if (li.lineCost !== undefined && li.lineCost !== null && !isNaN(li.lineCost)) {
				updateData.totalCost = { increment: li.lineCost };
			}
			
			if (li.lineProfit !== undefined && li.lineProfit !== null && !isNaN(li.lineProfit)) {
				updateData.totalProfit = { increment: li.lineProfit };
			}

			await tx.product.update({
				where: { id: li.productId },
				data: updateData
			});
		}

		return await tx.order.findUnique({
			where: { id: order.id },
			include: { 
				orderItems: {
					include: {
						product: true,
						variant: true
					}
				}, 
				createdBy: true 
			}
		});
	});
}

async function getOrders({ page = 1, limit = 20, status, paymentStatus, fromDate, toDate, search } = {}) {
	const skip = (page - 1) * limit;
	const where = {};
	if (status) where.status = status;
	if (paymentStatus) where.paymentStatus = paymentStatus;
	if (fromDate || toDate) where.createdAt = {};
	if (fromDate) where.createdAt.gte = new Date(fromDate);
	if (toDate) where.createdAt.lte = new Date(toDate);
	if (search) {
		where.OR = [
			{ orderNumber: { contains: search } },
			{ customerName: { contains: search, mode: 'insensitive' } },
			{ customerPhone: { contains: search } },
			{ customerEmail: { contains: search, mode: 'insensitive' } }
		];
	}

	const [orders, totalCount] = await Promise.all([
		prisma.order.findMany({
			where,
			skip,
			take: parseInt(limit),
			orderBy: { createdAt: 'desc' },
			include: { 
				orderItems: {
					include: {
						product: true,
						variant: true
					}
				}
			}
		}),
		prisma.order.count({ where })
	]);

	return {
		orders,
		pagination: {
			page: parseInt(page),
			limit: parseInt(limit),
			totalCount,
			totalPages: Math.ceil(totalCount / limit)
		}
	};
}

async function getOrderById(id) {
	const order = await prisma.order.findUnique({
		where: { id },
		include: { 
			orderItems: {
				include: {
					product: true,
					variant: true
				}
			}, 
			createdBy: true 
		}
	});
	return order;
}

async function updateOrderStatus(orderId, status) {
	const data = { status };
	// set timestamps for certain statuses
	if (status === ORDER_STATUS.CONFIRMED) data.confirmedAt = new Date();
	if (status === ORDER_STATUS.SHIPPED) data.shippedAt = new Date();
	if (status === ORDER_STATUS.DELIVERED) data.deliveredAt = new Date();
	if (status === ORDER_STATUS.CANCELLED) data.cancelledAt = new Date();

	const updated = await prisma.order.update({ 
		where: { id: orderId }, 
		data,
		include: {
			orderItems: {
				include: {
					product: true,
					variant: true
				}
			}
		}
	});
	return updated;
}

module.exports = {
	createOrder,
	getOrders,
	getOrderById,
	updateOrderStatus,
};