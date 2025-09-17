const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

router.get('/', campaignController.listCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/', authenticate, requireRole(['admin', 'sub_admin']), campaignController.createCampaign);
router.put('/:id', authenticate, requireRole(['admin', 'sub_admin']), campaignController.updateCampaign);
router.delete('/:id', authenticate, requireRole(['admin', 'sub_admin']), campaignController.deleteCampaign);
router.patch('/:id/performance', authenticate, requireRole(['admin', 'sub_admin']), campaignController.updateCampaignPerformance);

module.exports = router;
