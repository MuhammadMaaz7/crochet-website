"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    price,
    images,
    category,
    rating = { average: 0, count: 0 },
    stock = 0,
    colors,
    description,
  } = product

  const primaryImage =
    images && images.length > 0 ? images[0]?.url || images[0] : "/placeholder.svg?height=400&width=400"

  return (
    <Link to={`/products/${_id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />

          {/* Image Gallery Indicator */}
          {images && images.length > 1 && (
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-600">
              +{images.length - 1} more
            </div>
          )}

          {/* Stock Badge */}
          {stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
            {category}
          </div>

          {/* Overlay Buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                aria-label="Add to favorites"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="w-5 h-5 text-pink-500 hover:text-pink-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-pink-500/90 backdrop-blur-sm rounded-full shadow-md hover:bg-pink-600 transition-colors duration-200"
                aria-label="Add to cart"
                disabled={stock === 0}
                onClick={(e) => e.preventDefault()}
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
            <h3
              className="font-semibold text-xl text-gray-800 line-clamp-2"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              {name}
            </h3>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
              ${typeof price === "number" ? price.toFixed(2) : price}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2" style={{ fontFamily: "Quicksand, sans-serif" }}>
              {description}
            </p>
          )}

          {/* Color Options */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Colors:</span>
              <div className="flex items-center gap-1">
                {colors.slice(0, 4).map((color, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm cursor-pointer"
                    style={{ backgroundColor: color }}
                    aria-label={`Color option: ${color}`}
                  />
                ))}
                {colors.length > 4 && <span className="text-xs text-gray-500 ml-1">+{colors.length - 4}</span>}
              </div>
            </div>
          )}

          {/* Rating and Stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(rating.average || rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              {rating.count > 0 && <span className="text-sm text-gray-500 ml-1">({rating.count})</span>}
            </div>

            {stock > 0 && stock <= 5 && <div className="text-xs text-orange-600 font-medium">Only {stock} left</div>}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
