const campaignService = require('../services/campaign.service');
const { successResponse, errorResponse } = require('../utils/response');

async function listCampaigns(req, res) {
	try {
		const result = await campaignService.listCampaigns();
		return successResponse(res, 'Campaigns retrieved successfully', result);
	} catch (error) {
		console.error('Error listing campaigns:', error);
		return errorResponse(res, 'Failed to retrieve campaigns', 500);
	}
}

async function createCampaign(req, res) {
	try {
		const payload = req.body;
		if (req.user) payload.createdById = req.user.id;
		const campaign = await campaignService.createCampaign(payload);
		return successResponse(res, 'Campaign created successfully', campaign, 201);
	} catch (error) {
		console.error('Error creating campaign:', error);
		return errorResponse(res, error.message || 'Failed to create campaign', 400);
	}
}

module.exports = { listCampaigns, createCampaign };
