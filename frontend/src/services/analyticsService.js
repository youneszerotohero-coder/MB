import api from './api';

export const analyticsService = {
  // Get dashboard statistics
  async getDashboardStats(fromDate = null, toDate = null) {
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      
      const response = await api.get('/analytics/dashboard', { 
        params,
        timeout: 15000 // 15 seconds timeout
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Return default values for database connection errors
      if (error.response?.status === 503) {
        return {
          revenue: 0,
          ordersCount: 0,
          campaignSpend: 0,
          netProfit: 0,
          deliveryFees: 0
        };
      }
      
      throw error;
    }
  },

  // Get sales over time data
  async getSalesOverTime(period = 'daily', days = 30) {
    try {
      const response = await api.get('/analytics/sales', {
        params: { period, days },
        timeout: 15000 // 15 seconds timeout
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sales over time:', error);
      
      // Return empty array for database connection errors
      if (error.response?.status === 503) {
        return [];
      }
      
      throw error;
    }
  },

  // Get product profitability data
  async getProductProfitability(categoryId = null, limit = 50) {
    try {
      const params = { limit };
      if (categoryId) params.categoryId = categoryId;
      
      const response = await api.get('/analytics/products/profitability', { 
        params,
        timeout: 15000 // 15 seconds timeout
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product profitability:', error);
      
      // Return empty array for database connection errors
      if (error.response?.status === 503) {
        return [];
      }
      
      throw error;
    }
  }
};

export default analyticsService;

