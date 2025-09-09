import { 
  TrendingUp, 
  ShoppingCart, 
  Megaphone, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    name: "Total Revenue",
    value: "$124,592",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    color: "dashboard-revenue"
  },
  {
    name: "Total Orders",
    value: "1,429",
    change: "+8.2%",
    changeType: "positive", 
    icon: ShoppingCart,
    color: "dashboard-orders"
  },
  {
    name: "Campaign Spend",
    value: "$12,480",
    change: "+5.1%",
    changeType: "positive",
    icon: Megaphone,
    color: "dashboard-spend"
  },
  {
    name: "Net Profit",
    value: "$89,240",
    change: "+15.8%",
    changeType: "positive",
    icon: TrendingUp,
    color: "dashboard-profit"
  },
];

const recentProducts = [
  { name: "Premium T-Shirt", revenue: "$2,480", cost: "$1,240", profit: "$1,240", margin: "50%" },
  { name: "Designer Hoodie", revenue: "$3,920", cost: "$1,568", profit: "$2,352", margin: "60%" },
  { name: "Classic Jeans", revenue: "$1,840", cost: "$736", profit: "$1,104", margin: "60%" },
  { name: "Running Shoes", revenue: "$4,560", cost: "$2,280", profit: "$2,280", margin: "50%" },
  { name: "Winter Jacket", revenue: "$6,240", cost: "$2,496", profit: "$3,744", margin: "60%" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your e-commerce performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
            <p className="text-sm text-muted-foreground">Monthly revenue trend</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization will be here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground">Profitability per Product</CardTitle>
            <p className="text-sm text-muted-foreground">Top performing products</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Product chart will be here</p>
              </div>
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
                {recentProducts.map((product, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-foreground font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-foreground">{product.revenue}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.cost}</td>
                    <td className="py-3 px-4 text-success font-semibold">{product.profit}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success">
                        {product.margin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Campaign analytics will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}