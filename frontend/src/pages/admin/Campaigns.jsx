import { useState } from "react";
import { Plus, Search, Calendar, DollarSign, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  {
    id: 1,
    name: "Summer Collection Launch",
    cost: 5000,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    status: "active",
    linkedProducts: ["Premium T-Shirt", "Designer Hoodie"],
    type: "product_linked",
    performance: {
      impressions: 125000,
      clicks: 3200,
      conversions: 145,
      revenue: 12450
    }
  },
  {
    id: 2,
    name: "Brand Awareness Campaign",
    cost: 3500,
    startDate: "2024-01-05",
    endDate: "2024-01-20",
    status: "completed",
    linkedProducts: [],
    type: "general",
    performance: {
      impressions: 89000,
      clicks: 1800,
      conversions: 0,
      revenue: 0
    }
  },
  {
    id: 3,
    name: "Winter Clearance Sale",
    cost: 2800,
    startDate: "2024-01-15",
    endDate: "2024-01-31",
    status: "active",
    linkedProducts: ["Winter Jacket", "Classic Jeans"],
    type: "product_linked",
    performance: {
      impressions: 67000,
      clicks: 2100,
      conversions: 89,
      revenue: 8940
    }
  },
  {
    id: 4,
    name: "New Year Promotion",
    cost: 4200,
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    status: "completed",
    linkedProducts: ["Premium T-Shirt", "Running Shoes"],
    type: "product_linked",
    performance: {
      impressions: 156000,
      clicks: 4800,
      conversions: 234,
      revenue: 18720
    }
  }
];

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.performance.revenue, 0);
  const totalROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100) : 0;

  const getStatusBadge = (status) => {
    const config = {
      active: { label: "Active", class: "bg-success-light text-success" },
      completed: { label: "Completed", class: "bg-muted text-muted-foreground" },
      paused: { label: "Paused", class: "bg-warning-light text-warning" }
    };
    
    const statusConfig = config[status];
    return (
      <Badge variant="secondary" className={statusConfig.class}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getCampaignTypeBadge = (type) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type === 'product_linked' ? 'Product Linked' : 'General Marketing'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage marketing campaigns and track their performance
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-spend">
              ${totalSpend.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">All time marketing spend</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeCampaigns}</div>
            <div className="text-xs text-muted-foreground mt-1">Currently running</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaign Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-revenue">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-success mt-1">From campaign attribution</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalROI.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Return on investment</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Campaign</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Spend</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Performance</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">ROI</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const roi = campaign.cost > 0 ? ((campaign.performance.revenue - campaign.cost) / campaign.cost * 100) : 0;
                  
                  return (
                    <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-foreground">{campaign.name}</div>
                          {campaign.linkedProducts.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Linked: {campaign.linkedProducts.join(", ")}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getCampaignTypeBadge(campaign.type)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="text-foreground">{campaign.startDate}</div>
                          <div className="text-muted-foreground">to {campaign.endDate}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-dashboard-spend">
                          ${campaign.cost.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          <div className="text-foreground">
                            {campaign.performance.impressions.toLocaleString()} impressions
                          </div>
                          <div className="text-muted-foreground">
                            {campaign.performance.clicks.toLocaleString()} clicks • {campaign.performance.conversions} conversions
                          </div>
                          {campaign.performance.revenue > 0 && (
                            <div className="text-success font-medium">
                              ${campaign.performance.revenue.toLocaleString()} revenue
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`font-semibold ${roi > 0 ? 'text-success' : roi < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Campaign Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Performance trends chart will be here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              ROI by Campaign Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Product-Linked Campaigns</div>
                  <div className="text-sm text-muted-foreground">Higher conversion rate</div>
                </div>
                <div className="text-lg font-bold text-success">+127%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium text-foreground">General Marketing</div>
                  <div className="text-sm text-muted-foreground">Brand awareness focused</div>
                </div>
                <div className="text-lg font-bold text-muted-foreground">-100%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}