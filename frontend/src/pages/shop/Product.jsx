import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { Loader2, CheckCircle, AlertCircle, Check } from "lucide-react";
import statesData from "../../utils/statesData"
import ProductCard from '../../components/productCard';

// Main App Component
export default function App() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`)
      console.log('Product API response:', res.data)
      return res.data.data || res.data
    },
    enabled: !!id
  })

  const mainProduct = data || {
    name: '',
    price: 0,
    reviews: 0,
    images: [],
    colors: [],
    sizes: [],
    description: ''
  }

  // Process images properly 
  const productImages = Array.isArray(mainProduct.images) 
    ? mainProduct.images.map(img => img.url || img) 
    : []
  
  const mainImage = productImages[0] || '/placeholder-product.jpg'
  const thumbnails = productImages.length > 1 ? productImages.slice(1) : []

  // Fetch related products
  const { data: relatedProductsData } = useQuery({
    queryKey: ['related-products', mainProduct.categoryId],
    queryFn: async () => {
      const res = await api.get('/products', { 
        params: { 
          limit: 4, 
          sortBy: 'createdAt',
          sortOrder: 'desc'
        } 
      })
      return res.data.data
    },
    enabled: !!data
  })

  const relatedProducts = Array.isArray(relatedProductsData?.products) 
    ? relatedProductsData.products.filter(p => p.id !== id).slice(0, 4)
    : []

  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [selectedColor, setSelectedColor] = useState('Beige');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  
  // Checkout form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [commune, setCommune] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableCommunes, setAvailableCommunes] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Calculate pricing
  const productPrice = Number(mainProduct.price || 0)
  const subtotal = productPrice * quantity;
  const shipping = subtotal > 0 ? 600 : 0; // example shipping
  const total = subtotal + shipping;

  // ALL useEffect hooks MUST come before any conditional returns
  // Update selected image when product data changes
  useEffect(() => {
    if (data && productImages.length > 0) {
      setSelectedImage(productImages[0])
    }
  }, [data, productImages])

  // Set default color and size when product loads
  useEffect(() => {
    if (data && mainProduct.colors && mainProduct.colors.length > 0) {
      setSelectedColor(mainProduct.colors[0])
    }
    if (data && mainProduct.sizes && mainProduct.sizes.length > 0) {
      setSelectedSize(mainProduct.sizes[0])
    }
  }, [data, mainProduct.colors, mainProduct.sizes])

  useEffect(() => {
    if (state) {
      const selectedState = statesData[state];
      if (selectedState && selectedState.baladiyas) {
        setAvailableCommunes(selectedState.baladiyas);
        setCommune("");
      } else {
        setAvailableCommunes([]);
      }
    } else {
      setAvailableCommunes([]);
    }
  }, [state]);

  useEffect(() => {
    let timeoutId;
    if (notification.show) {
      timeoutId = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [notification.show]);

  // NOW it's safe to do conditional returns after ALL hooks are declared
  if (isLoading) return (
    <div className="mt-20 p-8 text-center">
      <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span>Loading product...</span>
      </div>
    </div>
  )
  
  if (isError) return (
    <div className="mt-20 p-8 text-center">
      <div className="text-red-600">Error loading product: {error?.message}</div>
      <div className="mt-4">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-amber-200 text-amber-800 rounded hover:bg-amber-300"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  if (!data) return (
    <div className="mt-20 p-8 text-center">
      <div className="text-gray-600">Product not found</div>
    </div>
  )

  const handleCheckout = async () => {
    if (!fullName || !phone) {
      setNotification({
        show: true,
        message: "Please fill out all required fields",
        type: "error"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call for order creation
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate a random order ID for demo purposes
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
      
      // Show success notification briefly
      setNotification({
        show: true,
        message: `Order ${orderId} created successfully! Redirecting...`,
        type: "success"
      });
      
      // Redirect to thank you page after a short delay
      setTimeout(() => {
        navigate('/thankyou', { 
          state: { 
            orderId,
            productName: mainProduct.name,
            quantity,
            total: (total / 100 + subtotal).toFixed(2),
            customerName: fullName
          }
        });
      }, 1000);
    }, 1500);
  };

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.374 2.45c-.3.218-.466.56-.466.906l1.286 3.963c.3.921-.755 1.688-1.54 1.118l-3.374-2.45c-.3-.218-.76-.218-1.06 0l-3.374 2.45c-.784.57-1.84-.197-1.54-1.118l1.286-3.963c.0-.346-.166-.688-.466-.906l-3.374-2.45c-.783-.57-.381-1.81.588-1.81h4.168c.35 0 .684-.207.846-.534l1.286-3.963z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="mt-20 bg-white font-sans text-gray-800 antialiased">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-200' 
            : 'bg-red-100 border border-red-200'
        } max-w-md`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            <span className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-8 md:px-6 lg:px-8">
        {/* Product Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:gap-16">
          {/* Images Section */}
          <div className="order-1 lg:pl-10">
            <div className="mb-4 h-[50vh] lg:h-[70vh] overflow-hidden rounded-lg bg-gray-100">
              <img
                src={selectedImage}
                alt={mainProduct.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {productImages.length > 1 && (
              <div className="h-24 flex justify-center space-x-2 md:space-x-4">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`w-1/4 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors duration-200 ${selectedImage === img ? 'border-gray-900' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="order-2 lg:pr-10">
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">{mainProduct.name}</h1>
            <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex">{renderStars(4)}</div>
              <span>({mainProduct.reviews} reviews)</span>
            </div>
            <p className="mb-6 text-2xl font-semibold">${Number(mainProduct.price || 0).toFixed(2)}</p>

            {/* Color Selector */}
            {mainProduct.colors && mainProduct.colors.length > 0 && (
              <div className="mb-6">
                <span className="block text-sm font-medium">
                  Color: <span className="font-semibold">{selectedColor}</span>
                </span>
                <div className="mt-2 flex space-x-2">
                  {mainProduct.colors.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 transition-colors duration-200 ${selectedColor === color ? 'border-gray-900' : 'border-gray-200'}`}
                      style={{ backgroundColor: color === 'Beige' ? '#E5D6C5' : color === 'Black' ? '#1E1E1E' : color === 'White' ? '#F4F4F4' : '#6A4D3B' }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selector */}
            {mainProduct.sizes && mainProduct.sizes.length > 0 && (
              <div className="mb-6">
                <span className="block text-sm font-medium">
                  Size: <span className="font-semibold">{selectedSize}</span>
                </span>
                <div className="mt-2 flex space-x-2">
                  {mainProduct.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border-2 rounded transition-colors duration-200 ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <span className="block text-sm font-medium mb-2">
                Quantity
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="">
              <h2 className='font-semibold mb-3 text-lg'>Description</h2>
              <p className='text-gray-600 leading-relaxed'>
                {mainProduct.description || 'This elegant handbag is perfect for any occasion. Made from high-quality materials, it offers both comfort and style. The bag features a flattering silhouette and subtle details that add a touch of sophistication. Available in various colors, it\'s designed to fit and flatter every body type.'}
              </p>
            </div>
            
          </div>
        </div>
            {/* Checkout Form */}
            <div className="border-t pt-2">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Complete Your Order</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Wilaya
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    >
                      <option value="">Select Wilaya</option>
                      {Object.keys(statesData).map((code) => (
                        <option key={code} value={code}>
                          {statesData[code].wilaya_ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">
                      Commune
                    </label>
                    <select
                      id="commune"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      disabled={!state}
                    >
                      <option value="">Select Commune</option>
                      {availableCommunes.map((baladia) => (
                        <option key={baladia} value={baladia}>
                          {baladia}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">* Required fields</p>
                </div>

                {/* Right: Order Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Order Summary</h3>

                  <div className="flex gap-3 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={selectedImage}
                        alt={mainProduct.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{mainProduct.name}</h4>
                      <p className="text-sm text-gray-500">Color: {selectedColor}</p>
                      <p className="text-sm text-gray-500">Qty: {quantity}</p>
                      <p className="text-sm font-medium mt-1 text-gray-800">
                        ${Number(mainProduct.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${(shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium text-gray-800">
                      <span>Total</span>
                      <span>${(total / 100 + subtotal).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-[#C2A977] hover:bg-[#b39966] text-black font-medium h-12"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </button>

                  <div className="flex items-center gap-2 mt-4 justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">Secure Checkout • SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-8 text-center text-xl font-bold md:text-2xl">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name || 'Unnamed Product'}
                  image={(product.images && product.images[0] && product.images[0].url) || product.image || product.thumbnail || '/placeholder-product.jpg'}
                  price={Number(product.price || product.finalPrice || 0)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}