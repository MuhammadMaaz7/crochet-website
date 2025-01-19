import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

export default function ProductCard({ product }) {
  return (
    <Link to={`/shop/${product._id}`}> {/* Wrap the card in a Link */}
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {/* Display the first image as the main image */}
          <img
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Image Gallery Indicator */}
          {product.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-600">
              +{product.images.length - 1} more
            </div>
          )}
          {/* Overlay Buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                aria-label="Add to favorites"
              >
                <Heart className="w-5 h-5 text-pink-500 hover:text-pink-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-pink-500/90 backdrop-blur-sm rounded-full shadow-md hover:bg-pink-600 transition-colors duration-200"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          {/* Name and Price */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-xl text-gray-800" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {product.name}
            </h3>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
              ${product.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            {product.description}
          </p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm cursor-pointer"
                    style={{ backgroundColor: color }}
                    aria-label={`Color option: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}