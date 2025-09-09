import { useState } from "react";
import { Plus, Minus, ShoppingCart, Trash2, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const availableProducts = [
  { id: 1, name: "Premium T-Shirt", price: 29.99, stock: 150, category: "T-Shirts" },
  { id: 2, name: "Designer Hoodie", price: 79.99, stock: 75, category: "Hoodies" },
  { id: 3, name: "Classic Jeans", price: 89.99, stock: 45, category: "Jeans" },
  { id: 4, name: "Running Shoes", price: 129.99, stock: 30, category: "Shoes" },
  { id: 5, name: "Winter Jacket", price: 199.99, stock: 20, category: "Jackets" },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [baladiya, setBaladiya] = useState("");

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.19; // 19% VAT
  const total = subtotal + tax;

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setWilaya("");
    setBaladiya("");
  };

  const processOrder = () => {
    if (cart.length === 0) return;

    alert(
      `Order processed for ${customerName || "Walk-in Customer"} - Total: $${total.toFixed(2)}`
    );
    clearCart();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Point of Sale (POS)</h1>
        <p className="text-muted-foreground mt-2">
          Create orders for in-store customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary-light text-primary">
                        {product.stock} in stock
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">
                        ${product.price}
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="bg-primary hover:bg-primary-hover"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Checkout Section */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Wilaya</label>
                  <Select value={wilaya} onValueChange={setWilaya}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alger">Alger</SelectItem>
                      <SelectItem value="oran">Oran</SelectItem>
                      <SelectItem value="constantine">Constantine</SelectItem>
                      <SelectItem value="blida">Blida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Baladiya</label>
                  <Input
                    value={baladiya}
                    onChange={(e) => setBaladiya(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Shopping Cart</CardTitle>
                <Badge variant="secondary" className="bg-primary-light text-primary">
                  {cart.length} items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (19%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between text-lg font-semibold text-foreground">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={processOrder}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="lg"
                  >
                    Process Order
                  </Button>
                  <Button onClick={clearCart} variant="outline" className="w-full">
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
