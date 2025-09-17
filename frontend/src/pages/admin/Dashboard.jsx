import { 
  TrendingUp, 
  ShoppingCart, 
  Megaphone, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import analyticsService from "@/services/analyticsService";
import DateRangePicker from "@/components/DateRangePicker";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Helper function to format number with commas
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    fromDate: null,
    toDate: null
  });

  // Handle date range changes
  const handleDateChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stats, sales, products] = await Promise.all([
        analyticsService.getDashboardStats(dateRange.fromDate, dateRange.toDate),
        analyticsService.getSalesOverTime('daily', 30),
        analyticsService.getProductProfitability(null, 10)
      ]);

      setDashboardData(stats);
      setSalesData(Array.isArray(sales) ? sales : []);
      setProductData(Array.isArray(products) ? products : []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      // Check if it's a 500 error (server error) vs other errors
      if (err.response?.status === 500) {
        setError('Server error occurred. Please check if the backend is running and try again.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view analytics.');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
      
      // Set empty data on error to prevent crashes
      setDashboardData(null);
      setSalesData([]);
      setProductData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // Calculate percentage change (mock calculation for now)
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Generate stats array from dashboard data
  const getStatsArray = () => {
    if (!dashboardData) return [];
    
    return [
      {
        name: "Total Revenue",
        value: formatCurrency(dashboardData.revenue || 0),
        change: "+12.5%", // Mock data - would need historical data for real calculation
        changeType: "positive",
        icon: DollarSign,
        color: "dashboard-revenue"
      },
      {
        name: "Total Orders",
        value: formatNumber(dashboardData.ordersCount || 0),
        change: "+8.2%", // Mock data
        changeType: "positive", 
        icon: ShoppingCart,
        color: "dashboard-orders"
      },
      {
        name: "Campaign Spend",
        value: formatCurrency(dashboardData.campaignSpend || 0),
        change: "+5.1%", // Mock data
        changeType: "positive",
        icon: Megaphone,
        color: "dashboard-spend"
      },
      {
        name: "Net Profit",
        value: formatCurrency(dashboardData.netProfit || 0),
        change: "+15.8%", // Mock data
        changeType: "positive",
        icon: TrendingUp,
        color: "dashboard-profit"
      },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your e-commerce performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangePicker 
            onDateChange={handleDateChange}
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
          />
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-md border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {getStatsArray().map((stat) => (
          <Card key={stat.name} className="stats-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color === 'dashboard-revenue' ? 'bg-dashboard-revenue/10' : stat.color === 'dashboard-orders' ? 'bg-dashboard-orders/10' : stat.color === 'dashboard-spend' ? 'bg-dashboard-spend/10' : 'bg-dashboard-profit/10'}`}>
                <stat.icon className={`h-4 w-4 ${stat.color === 'dashboard-revenue' ? 'text-dashboard-revenue' : stat.color === 'dashboard-orders' ? 'text-dashboard-orders' : stat.color === 'dashboard-spend' ? 'text-dashboard-spend' : 'text-dashboard-profit'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-success mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">Daily revenue trend (Last 30 days)</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {salesData.length > 0 ? (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-end justify-between h-48 space-x-1">
                    {salesData.map((day, index) => {
                      const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                      const height = (day.revenue / maxRevenue) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                            style={{ height: `${height}%` }}
                            title={`${new Date(day.date).toLocaleDateString()}: ${formatCurrency(day.revenue)}`}
                          />
                          <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Total: {formatCurrency(salesData.reduce((sum, day) => sum + Number(day.revenue), 0))}</span>
                    <span>Orders: {salesData.reduce((sum, day) => sum + Number(day.orders), 0)}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No sales data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground">Top Products by Profit</CardTitle>
            <p className="text-sm text-muted-foreground">Most profitable products</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {productData.length > 0 ? (
                <div className="space-y-3">
                  {productData.slice(0, 5).map((product, index) => {
                    const maxProfit = Math.max(...productData.map(p => p.totalProfit));
                    const width = (product.totalProfit / maxProfit) * 100;
                    return (
                      <div key={product.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate">{product.name}</span>
                          <span className="text-success font-semibold">{formatCurrency(product.totalProfit)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full transition-all duration-300"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Revenue: {formatCurrency(product.totalRevenue)}</span>
                          <span>Margin: {product.profitMargin}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No product data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Analysis Table */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-foreground">Profitability Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue, cost, and profit breakdown by product
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {productData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cost</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Profit</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 text-foreground font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-foreground">{formatCurrency(product.totalRevenue)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatCurrency(product.totalCost)}</td>
                      <td className="py-3 px-4 text-success font-semibold">{formatCurrency(product.totalProfit)}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success">
                          {product.profitMargin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No product profitability data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Impact Section */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-foreground">Campaign Impact</CardTitle>
          <p className="text-sm text-muted-foreground">
            How marketing campaigns are affecting your sales
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            {dashboardData ? (
              <div className="h-full flex flex-col justify-center items-center space-y-4">
                <div className="text-center">
                  <Megaphone className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-foreground">Campaign Spend</h3>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(dashboardData.campaignSpend)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(dashboardData.revenue)}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-lg font-semibold text-success">
                      {dashboardData.campaignSpend > 0 
                        ? `${((dashboardData.revenue / dashboardData.campaignSpend) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <div className="text-center">
                  <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Campaign analytics will be displayed here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}