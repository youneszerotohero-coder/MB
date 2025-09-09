import { useState } from "react";
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: 1, name: "T-Shirts", products: 45, status: "active" },
  { id: 2, name: "Hoodies", products: 23, status: "active" },
  { id: 3, name: "Jeans", products: 18, status: "active" },
  { id: 4, name: "Shoes", products: 32, status: "active" },
  { id: 5, name: "Accessories", products: 12, status: "active" },
];

const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "T-Shirts",
    price: "$29.99",
    cost: "$12.00",
    profit: "$17.99",
    stock: 150,
    colors: ["Black", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    images: 3,
    status: "active"
  },
  {
    id: 2,
    name: "Designer Hoodie",
    category: "Hoodies",
    price: "$79.99",
    cost: "$32.00",
    profit: "$47.99",
    stock: 75,
    colors: ["Gray", "Black", "Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: 5,
    status: "active"
  },
  {
    id: 3,
    name: "Classic Denim Jeans",
    category: "Jeans",
    price: "$89.99",
    cost: "$36.00",
    profit: "$53.99",
    stock: 0,
    colors: ["Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36"],
    images: 4,
    status: "out_of_stock"
  },
];

export default function AProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and categories
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {category.products} products
                    </span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      {category.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Product</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Price/Cost</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Profit</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Variants</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.images} images</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-foreground">{product.category}</td>
                        <td className="py-4 px-6">
                          <div className="text-foreground font-medium">{product.price}</div>
                          <div className="text-sm text-muted-foreground">{product.cost}</div>
                        </td>
                        <td className="py-4 px-6 text-success font-semibold">{product.profit}</td>
                        <td className="py-4 px-6">
                          <span className={`font-medium ${product.stock > 0 ? 'text-foreground' : 'text-destructive'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                              Colors: {product.colors.join(", ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Sizes: {product.sizes.join(", ")}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant="secondary" 
                            className={`${
                              product.status === 'active' 
                                ? 'bg-success-light text-success' 
                                : 'bg-warning-light text-warning'
                            }`}
                          >
                            {product.status === 'active' ? 'Active' : 'Out of Stock'}
                          </Badge>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}