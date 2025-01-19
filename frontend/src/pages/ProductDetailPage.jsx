// pages/ProductDetailPage.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import ProductCard from '../components/Landing/ProductCard';

const product = {
  _id: '1',
  name: 'Cozy Comfort Blanket',
  description: 'Wrap yourself in warmth with our handcrafted Cozy Comfort Blanket. Perfect for chilly evenings or as a thoughtful gift.',
  price: 89.99,
  rating: 4.8,
  colors: ['#F9A8D4', '#C4B5FD', '#93C5FD', '#6EE7B7'],
  sizes: ['Small', 'Medium', 'Large'],
  images: [
    '/images/blanket1.jpg',
    '/images/blanket2.jpg',
    '/images/blanket3.jpg',
    '/images/blanket4.jpg',
  ],
};

const relatedProducts = [
  // ... add some related product objects here
];

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Added to cart:', { ...product, color: selectedColor, size: selectedSize, quantity });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-between">
              <button
                onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                    currentImage === index ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} className="w-full h-full object-center object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Pacifico, cursive' }}>{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
            </div>
            <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                      selectedColor === color ? 'ring-2 ring-pink-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      selectedSize === size
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-2 py-1 border rounded-md"
                >
                  -
                </button>
                <span className="px-4 py-1 border rounded-md">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-2 py-1 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart and Wishlist */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 inline-block mr-2" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-md border border-pink-500 text-pink-500 font-medium hover:bg-pink-50 transition-colors"
              >
                <Heart className="w-5 h-5 inline-block" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Pacifico, cursive' }}>You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}