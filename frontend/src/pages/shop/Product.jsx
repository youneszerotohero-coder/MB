import React, { useState } from 'react';

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
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

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

            {/* Size Selector */}
            <div className="mb-6">
              <span className="block text-sm font-medium">Size</span>
              <div className="mt-2 flex space-x-2">
                {mainProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-medium transition-colors duration-200 ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-500'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Buttons */}
            <div>
                <h1 className='font-semibold my-3'>Description</h1>
                <p className='text-gray-600'>This elegant handbag is perfect for any occasion. Made from high-quality materials, it offers both comfort and style. The bag features a flattering silhouette and subtle details that add a touch of sophistication. Available in various colors, it's designed to fit and flatter every body type.</p>
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
              // <button className=" w-full rounded-md bg-yellow-500 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-yellow-600">
              //   Buy Now
              // </button>