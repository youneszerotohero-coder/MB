const campaignService = require('../services/campaign.service');
const { successResponse, errorResponse } = require('../utils/response');

async function listCampaigns(req, res) {
	try {
		const { page = 1, limit = 50 } = req.query;
		const result = await campaignService.listCampaigns({ page, limit });
		return successResponse(res, 'Campaigns retrieved successfully', result);
	} catch (error) {
		console.error('Error listing campaigns:', error);
		return errorResponse(res, 'Failed to retrieve campaigns', 500);
	}
}

async function getCampaignById(req, res) {
	try {
		const { id } = req.params;
		const campaign = await campaignService.getCampaignById(id);
		return successResponse(res, 'Campaign retrieved successfully', campaign);
	} catch (error) {
		console.error('Error fetching campaign:', error);
		return errorResponse(res, error.message || 'Failed to retrieve campaign', 404);
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

async function updateCampaign(req, res) {
	try {
		const { id } = req.params;
		const payload = req.body;
		const campaign = await campaignService.updateCampaign(id, payload);
		return successResponse(res, 'Campaign updated successfully', campaign);
	} catch (error) {
		console.error('Error updating campaign:', error);
		return errorResponse(res, error.message || 'Failed to update campaign', 400);
	}
}

async function deleteCampaign(req, res) {
	try {
		const { id } = req.params;
		await campaignService.deleteCampaign(id);
		return successResponse(res, 'Campaign deleted successfully');
	} catch (error) {
		console.error('Error deleting campaign:', error);
		return errorResponse(res, error.message || 'Failed to delete campaign', 400);
	}
}

async function updateCampaignPerformance(req, res) {
	try {
		const { id } = req.params;
		const performanceData = req.body;
		const result = await campaignService.updateCampaignPerformance(id, performanceData);
		return successResponse(res, 'Campaign performance updated successfully', result);
	} catch (error) {
		console.error('Error updating campaign performance:', error);
		return errorResponse(res, error.message || 'Failed to update campaign performance', 400);
	}
}

module.exports = { 
	listCampaigns, 
	getCampaignById,
	createCampaign, 
	updateCampaign, 
	deleteCampaign, 
	updateCampaignPerformance 
};
