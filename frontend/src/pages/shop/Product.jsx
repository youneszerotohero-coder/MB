import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Check } from "lucide-react";
import statesData from "../../utils/statesData"
import ProductCard from '../../components/productCard';

// Main App Component
export default function App() {
  const mainProduct = {
    name: "Elegant Beige Handbag",
    price: 199.00,
    reviews: 12,
    images: {
      main: "https://i.pinimg.com/1200x/3e/82/8f/3e828f5d730c60e48ba7ac580ebcbf74.jpg",
      thumbnails: [
        "https://i.pinimg.com/736x/fb/8e/bb/fb8ebb6ccd2b9dbed481ff497758ebe8.jpg",
        "https://i.pinimg.com/1200x/3e/82/8f/3e828f5d730c60e48ba7ac580ebcbf74.jpg",
        "https://i.pinimg.com/1200x/72/ac/f8/72acf804eafc84f86d73c409a0bf7478.jpg",
        "https://i.pinimg.com/736x/63/2f/da/632fdade106f8b33cce0e935981e60c6.jpg",
      ],
    },
    colors: ['Beige', 'Black', 'White', 'Brown'],
    sizes: ['Small', 'Medium', 'Large'],
  };

  const relatedProducts = [
    {
      name: "Crisp White Handbag",
      price: 99.99,
      image: "https://i.pinimg.com/736x/63/2f/da/632fdade106f8b33cce0e935981e60c6.jpg",
    },
    {
      name: "Classic Black Handbag",
      price: 129.00,
      image: "https://i.pinimg.com/1200x/72/ac/f8/72acf804eafc84f86d73c409a0bf7478.jpg",
    },
    {
      name: "Chic Grey Handbag",
      price: 159.99,
      image: "https://i.pinimg.com/1200x/3e/82/8f/3e828f5d730c60e48ba7ac580ebcbf74.jpg",
    },
    {
      name: "Luxurious Brown Handbag",
      price: 249.00,
      image: "https://i.pinimg.com/736x/fb/8e/bb/fb8ebb6ccd2b9dbed481ff497758ebe8.jpg",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(mainProduct.images.main);
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
  const subtotal = mainProduct.price * quantity;
  const shipping = subtotal > 0 ? 600 : 0; // example shipping
  const total = subtotal + shipping;

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
    setTimeout(() => {
      setIsProcessing(false);
      setNotification({
        show: true,
        message: `Order #ABC-123 has been created successfully!`,
        type: "success"
      });
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
            <div className="h-24 flex justify-center space-x-2 md:space-x-4">
              {mainProduct.images.thumbnails.map((img, index) => (
                <div
                  key={index}
                  className={`w-1/4 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors duration-200 ${selectedImage === img ? 'border-gray-900' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="order-2 lg:pr-10">
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">{mainProduct.name}</h1>
            <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex">{renderStars(4)}</div>
              <span>({mainProduct.reviews} reviews)</span>
            </div>
            <p className="mb-6 text-2xl font-semibold">${mainProduct.price.toFixed(2)}</p>

            {/* Color Selector */}
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
            {/* Description */}
            <div className="">
              <h2 className='font-semibold mb-3 text-lg'>Description</h2>
              <p className='text-gray-600 leading-relaxed'>This elegant handbag is perfect for any occasion. Made from high-quality materials, it offers both comfort and style. The bag features a flattering silhouette and subtle details that add a touch of sophistication. Available in various colors, it's designed to fit and flatter every body type.</p>
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
                        ${mainProduct.price.toFixed(2)}
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
        <div className="mt-12">
          <h2 className="mb-8 text-center text-xl font-bold md:text-2xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
            {relatedProducts.map((product, index) => (
              <div key={index} className="overflow-hidden rounded-md bg-white">
                <div className="aspect-square w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm font-semibold sm:text-base">{product.name}</h3>
                  <p className="text-xs text-gray-500 sm:text-sm">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}