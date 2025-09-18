const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/orders', require('./order.routes'));
router.use('/campaigns', require('./campaign.routes'));
router.use('/analytics', require('./analytics.routes'));
router.use('/upload', require('./upload.routes'));
router.use('/health', require('./health.routes'));

module.exports = router;
