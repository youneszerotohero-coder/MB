import React, { useState } from 'react';
import { X, Loader2, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

// --- MOCK DATA & HELPERS ---
// This replaces data and functions that would come from a backend.

const mockCartItems = [
  {
    productId: 'prod_1',
    colorId: 'color_black',
    sizeId: 'size_m',
    quantity: 1,
    product: {
      name: "Classic Leather Jacket",
      price: 189.99,
      imageUrl: "/placeholder-jacket.jpg", // Use a valid path to a placeholder image
    },
    color: { name: "Black" },
    size: { name: "Medium" },
  },
  {
    productId: 'prod_2',
    colorId: null,
    sizeId: 'size_10',
    quantity: 2,
    product: {
      name: "Suede Ankle Boots",
      price: 75.50,
      imageUrl: "/placeholder-boots.jpg", // Use a valid path to a placeholder image
    },
    color: null,
    size: { name: "10" },
  },
];

// A simple utility to format currency.
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};


export function Cart() {
  const [cartOpen, setCartOpen] = useState(true); // Cart is open by default for demonstration
  const [items, setItems] = useState(mockCartItems);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- DERIVED STATE ---
  // Values calculated from the 'items' state.
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // --- SIMULATED FUNCTIONS ---
  // These functions mimic API calls with a short delay.

  const updateQuantity = (productId, newQuantity, colorId, sizeId) => {
    setIsUpdating(true);
    setTimeout(() => {
      setItems(currentItems =>
        currentItems.map(item =>
          item.productId === productId && item.colorId === colorId && item.sizeId === sizeId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setIsUpdating(false);
    }, 500); // 0.5-second delay
  };

  const removeItem = (productId, colorId, sizeId) => {
    setIsUpdating(true);
    setTimeout(() => {
      setItems(currentItems =>
        currentItems.filter(item =>
          !(item.productId === productId && item.colorId === colorId && item.sizeId === sizeId)
        )
      );
      setIsUpdating(false);
    }, 500);
  };
  
  const handleCheckout = () => {
    setIsUpdating(true);
    console.log("Navigating to checkout...");
    setTimeout(() => {
      setIsUpdating(false);
      setCartOpen(false); // Close cart after "navigating"
    }, 1000);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } w-full md:w-1/2 lg:w-1/3 h-screen flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({itemCount} items)</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.colorId || ''}-${item.sizeId || ''}`}
                  className="flex items-start space-x-4 border-b pb-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.imageUrl || "/product-images/default-product.jpg"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-gray-600">{formatCurrency(item.product?.price || 0)}</p>
                    
                    {(item.color || item.size) && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item.color && <span>Color: {item.color.name}</span>}
                        {item.color && item.size && <span> | </span>}
                        {item.size && <span>Size: {item.size.name}</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.colorId, item.sizeId)}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Decrease quantity"
                        disabled={isUpdating}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.colorId, item.sizeId)}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Increase quantity"
                        disabled={isUpdating}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.colorId, item.sizeId)}
                    className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
                    aria-label="Remove item"
                    disabled={isUpdating}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4 bg-gray-50">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <button
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isUpdating || items.length === 0}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full text-center py-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => setCartOpen(false)}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Overlay for cart */}
      {cartOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setCartOpen(false)}></div>}
    </>
  );
}