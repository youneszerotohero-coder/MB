const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

router.get('/', campaignController.listCampaigns);

router.post('/', authenticate, requireRole(['admin', 'sub_admin']), campaignController.createCampaign);

module.exports = router;
