import { CheckCircle, ShoppingBag, User, CreditCard, Calendar, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data passed from the product page, or use defaults
  const orderData = location.state || {
    orderId: '#ORD-DEFAULT-001',
    customerName: 'Customer',
    productName: 'Product',
    quantity: 1,
    total: '0.00'
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleReturnToShop = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-white mt-12 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with checkmark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600">Your order has been successfully placed</p>
        </div>

        {/* Order confirmation card */}
        <div className="bg-white border-2 border-gray-100 rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Card header */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6" style={{ color: '#C8B28D' }} />
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#C8B28D' }}>
                Confirmed
              </span>
            </div>
          </div>

          {/* Order info */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{orderData.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium text-gray-900">{orderData.orderId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">{orderData.quantity} item(s)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product details */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{orderData.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {orderData.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${orderData.total}</p>
                    <p className="text-sm text-gray-500">total</p>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-6 space-y-3">
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total Paid</span>
                    <span style={{ color: '#C8B28D' }}>${orderData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation note */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Phone className="w-6 h-6 mt-0.5" style={{ color: '#C8B28D' }} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-gray-700">
                We will call you soon to confirm the sale and arrange delivery details. 
                Please keep your phone available for our call.
              </p>
            </div>
          </div>
        </div>

        {/* Return to shop button */}
        <div className="text-center">
          <button
            onClick={handleReturnToShop}
            className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            style={{ backgroundColor: '#C8B28D' }}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Need help? Contact us at support@shop.com
          </p>
        </div>
      </div>
    </div>
  );
}