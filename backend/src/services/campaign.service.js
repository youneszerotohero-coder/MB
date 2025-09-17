const { prisma } = require('../config/database');

/**
 * Create a campaign. If productIds provided, create CampaignProduct entries and distribute allocated cost equally.
 */
async function createCampaign(payload) {
  const {
    name,
    description = null,
    cost = 0,
    budget = null,
    startDate,
    endDate = null,
    campaignType = null,
    isActive = true,
    productIds = [],
    createdById,
  } = payload;

  if (!name || !startDate) throw new Error('Name and startDate are required');

  return await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        name,
        description,
        cost,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        campaignType,
        isActive,
        createdById,
      }
    });

    if (Array.isArray(productIds) && productIds.length > 0) {
      const perProduct = Number((cost / productIds.length).toFixed(2));
      for (const pid of productIds) {
        await tx.campaignProduct.create({
          data: {
            campaignId: campaign.id,
            productId: pid,
            allocatedCost: perProduct,
          }
        });
      }
    }

    return await tx.campaign.findUnique({ where: { id: campaign.id }, include: { campaignProducts: true, createdBy: true } });
  });
}

async function listCampaigns({ page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const [campaigns, totalCount] = await Promise.all([
    prisma.campaign.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { startDate: 'desc' },
      include: { campaignProducts: true, createdBy: true }
    }),
    prisma.campaign.count()
  ]);

  return { campaigns, pagination: { page: parseInt(page), limit: parseInt(limit), totalCount, totalPages: Math.ceil(totalCount / limit) } };
}

module.exports = { createCampaign, listCampaigns };
/**
 * Create a campaign. If productIds provided, create CampaignProduct entries and distribute cost evenly.
 */
async function createCampaign(payload) {
  const {
    name,
    description = null,
    cost = 0,
    budget = null,
    startDate,
    endDate = null,
    campaignType = null,
    isActive = true,
    productIds = [],
    createdById,
  } = payload;

  if (!name || !startDate) throw new Error('Name and startDate are required');

  return await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        name,
        description,
        cost,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        campaignType,
        isActive,
        createdById,
      }
    });

    if (Array.isArray(productIds) && productIds.length > 0) {
      const perProduct = Number((cost / productIds.length).toFixed(2));
      for (const pid of productIds) {
        await tx.campaignProduct.create({
          data: {
            campaignId: campaign.id,
            productId: pid,
            allocatedCost: perProduct,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
          }
        });
      }
    }

    return await tx.campaign.findUnique({ where: { id: campaign.id }, include: { campaignProducts: true, createdBy: true } });
  });
}

async function listCampaigns({ page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const [campaigns, totalCount] = await Promise.all([
    prisma.campaign.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { startDate: 'desc' },
      include: { campaignProducts: true, createdBy: true }
    }),
    prisma.campaign.count()
  ]);

  return { campaigns, pagination: { page: parseInt(page), limit: parseInt(limit), totalCount, totalPages: Math.ceil(totalCount / limit) } };
}

module.exports = { createCampaign, listCampaigns };
async function listCampaigns() {
  return await prisma.campaign.findMany({
    orderBy: { startDate: 'desc' },
    include: { campaignProducts: { include: { product: true } }, createdBy: true }
  });
}

/**
 * Create campaign. If productIds provided, link them and distribute allocated_cost equally.
 */
async function createCampaign(payload) {
  const {
    name,
    description = null,
    cost = 0,
    budget = null,
    startDate,
    endDate = null,
    campaignType = null,
    isActive = true,
    productIds = [],
    createdById,
  } = payload;

  if (!name || !startDate) throw new Error('name and startDate are required');

  return await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        name,
        description,
        cost,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        campaignType,
        isActive,
        createdById,
      }
    });

    if (Array.isArray(productIds) && productIds.length > 0) {
      const allocated = Number((cost / productIds.length).toFixed(2));
      for (const pid of productIds) {
        await tx.campaignProduct.create({
          data: {
            campaignId: campaign.id,
            productId: pid,
            allocatedCost: allocated
          }
        });
      }
    }

    return await tx.campaign.findUnique({ where: { id: campaign.id }, include: { campaignProducts: true, createdBy: true } });
  });
}

async function getCampaignById(campaignId) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { 
      campaignProducts: { 
        include: { product: true } 
      }, 
      createdBy: true 
    }
  });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  return campaign;
}

async function updateCampaign(campaignId, payload) {
  const {
    name,
    description = null,
    cost = 0,
    budget = null,
    startDate,
    endDate = null,
    campaignType = null,
    isActive = true,
    productIds = [],
  } = payload;

  if (!name || !startDate) throw new Error('Name and startDate are required');

  return await prisma.$transaction(async (tx) => {
    // Update the campaign
    const campaign = await tx.campaign.update({
      where: { id: campaignId },
      data: {
        name,
        description,
        cost,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        campaignType,
        isActive,
      }
    });

    // Update campaign products if provided
    if (Array.isArray(productIds)) {
      // Remove existing campaign products
      await tx.campaignProduct.deleteMany({
        where: { campaignId }
      });

      // Add new campaign products
      if (productIds.length > 0) {
        const perProduct = Number((cost / productIds.length).toFixed(2));
        for (const pid of productIds) {
          await tx.campaignProduct.create({
            data: {
              campaignId,
              productId: pid,
              allocatedCost: perProduct,
            }
          });
        }
      }
    }

    return await tx.campaign.findUnique({ 
      where: { id: campaignId }, 
      include: { campaignProducts: { include: { product: true } }, createdBy: true } 
    });
  });
}

async function deleteCampaign(campaignId) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  await prisma.campaign.delete({
    where: { id: campaignId }
  });

  return { message: 'Campaign deleted successfully' };
}

async function updateCampaignPerformance(campaignId, performanceData) {
  const { campaignProductUpdates = [], campaignMetrics = {} } = performanceData;

  return await prisma.$transaction(async (tx) => {
    // Update campaign-level metrics
    if (Object.keys(campaignMetrics).length > 0) {
      await tx.campaign.update({
        where: { id: campaignId },
        data: campaignMetrics
      });
    }

    // Update campaign product performance
    for (const update of campaignProductUpdates) {
      await tx.campaignProduct.updateMany({
        where: {
          campaignId,
          productId: update.productId
        },
        data: {
          impressions: update.impressions || 0,
          clicks: update.clicks || 0,
          conversions: update.conversions || 0,
          revenue: update.revenue || 0,
        }
      });
    }

    return await tx.campaign.findUnique({
      where: { id: campaignId },
      include: { 
        campaignProducts: { 
          include: { product: true } 
        }, 
        createdBy: true 
      }
    });
  });
}

module.exports = { 
  listCampaigns, 
  getCampaignById,
  createCampaign, 
  updateCampaign, 
  deleteCampaign, 
  updateCampaignPerformance 
};
