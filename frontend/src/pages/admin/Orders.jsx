import { useState } from "react";
import { Search, Eye, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const orders = [
  {
    id: "ORD-2024-001",
    customer: "Ahmed Benali",
    wilaya: "Alger",
    baladiya: "Bab Ezzouar", 
    status: "pending",
    total: "$129.98",
    date: "2024-01-15",
    items: 3
  },
  {
    id: "ORD-2024-002", 
    customer: "Fatima Zohra",
    wilaya: "Oran",
    baladiya: "Es Senia",
    status: "confirmed",
    total: "$89.99",
    date: "2024-01-15",
    items: 2
  },
  {
    id: "ORD-2024-003",
    customer: "Mohamed Larbi",
    wilaya: "Constantine", 
    baladiya: "El Khroub",
    status: "shipped",
    total: "$199.97",
    date: "2024-01-14",
    items: 4
  },
  {
    id: "ORD-2024-004",
    customer: "Amina Kaci",
    wilaya: "Blida",
    baladiya: "Boufarik",
    status: "delivered",
    total: "$79.99",
    date: "2024-01-14", 
    items: 1
  },
  {
    id: "ORD-2024-005",
    customer: "Yacine Brahimi",
    wilaya: "Tizi Ouzou",
    baladiya: "Azazga",
    status: "pending",
    total: "$149.98",
    date: "2024-01-13",
    items: 2
  },
];

const statusConfig = {
  pending: { label: "Pending", class: "bg-warning-light text-warning" },
  confirmed: { label: "Confirmed", class: "bg-primary-light text-primary" },
  shipped: { label: "Shipped", class: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", class: "bg-success-light text-success" }
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wilayaFilter, setWilayaFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesWilaya = wilayaFilter === "all" || order.wilaya === wilayaFilter;
    
    return matchesSearch && matchesStatus && matchesWilaya;
  });

  const getStatusBadge = (status) => {
    const config = statusConfig[status];
    return (
      <Badge variant="secondary" className={config.class}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track customer orders
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,429</div>
            <div className="text-xs text-success mt-1">+8.2% from last month</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">23</div>
            <div className="text-xs text-muted-foreground mt-1">Requires attention</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shipped Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">45</div>
            <div className="text-xs text-success mt-1">On schedule</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">1,361</div>
            <div className="text-xs text-success mt-1">95.2% success rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Order Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={wilayaFilter} onValueChange={setWilayaFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by wilaya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wilayas</SelectItem>
                <SelectItem value="Alger">Alger</SelectItem>
                <SelectItem value="Oran">Oran</SelectItem>
                <SelectItem value="Constantine">Constantine</SelectItem>
                <SelectItem value="Blida">Blida</SelectItem>
                <SelectItem value="Tizi Ouzou">Tizi Ouzou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Order ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Location</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Total</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm font-medium text-primary">
                        {order.id}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.items} items</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-foreground">{order.wilaya}</div>
                      <div className="text-sm text-muted-foreground">{order.baladiya}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground">
                      {order.total}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Mark Pending</SelectItem>
                            <SelectItem value="confirmed">Mark Confirmed</SelectItem>
                            <SelectItem value="shipped">Mark Shipped</SelectItem>
                            <SelectItem value="delivered">Mark Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}