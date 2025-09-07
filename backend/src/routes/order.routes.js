const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

// Public checkout route
router.post('/', validateRequest('createOrder'), orderController.createOrder);

// In-store (POS) order creation for admins/sub-admins
router.post('/pos', authenticate, requireRole(['admin', 'sub_admin']), validateRequest('createOrder'), async (req, res) => {
	// Force orderSource to POS
	req.body.orderSource = 'pos';
	return orderController.createOrder(req, res);
});

// Protected routes for admins/staff
router.use(authenticate);
router.get('/', requireRole(['admin', 'sub_admin']), orderController.listOrders);
router.get('/:id', requireRole(['admin', 'sub_admin']), orderController.getOrder);
router.patch('/:id/status', requireRole(['admin', 'sub_admin']), validateRequest('updateOrderStatus'), orderController.updateStatus);

module.exports = router;
