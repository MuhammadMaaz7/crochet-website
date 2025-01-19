import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white rounded-full shadow-lg"
            >
              <Heart className="w-5 h-5 text-pink-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-pink-500 rounded-full shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-800" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          </div>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
            ${product.price}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {product.colors?.map((color, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1">
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
  );
}