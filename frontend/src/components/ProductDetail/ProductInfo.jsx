"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import ColorSelector from "./ColorSelector"
import SizeSelector from "./SizeSelector"
import QuantitySelector from "./QuantitySelector"
import toast from "react-hot-toast"

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error("Not enough stock available")
      return
    }

    addToCart(product, quantity, selectedColor, selectedSize)
    toast.success("Added to cart!")
  }

  const handleWishlist = () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add to wishlist")
      return
    }

    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const discountPercentage = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Product Title and Rating */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating?.average || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">({product.rating?.count || 0} reviews)</span>
          <span className="text-green-600 font-medium">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-pink-600">${product.discountedPrice || product.price}</span>
        {product.discountedPrice && product.discountedPrice < product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">${product.price}</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Materials */}
      {product.materials && product.materials.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Materials</h3>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((material, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {material}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <ColorSelector colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} />
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} />
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} max={product.stock} />

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlist}
            className={`p-3 rounded-lg border-2 transition-colors ${
              isWishlisted
                ? "border-pink-500 bg-pink-50 text-pink-600"
                : "border-gray-300 text-gray-600 hover:border-pink-500 hover:text-pink-600"
            }`}
          >
            <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Care Instructions */}
      {product.careInstructions && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Care Instructions</h3>
          <p className="text-gray-600">{product.careInstructions}</p>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6 text-green-600" />
          <div>
            <div className="font-medium text-gray-900">Free Shipping</div>
            <div className="text-sm text-gray-600">On orders over $50</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">Quality Guarantee</div>
            <div className="text-sm text-gray-600">Handmade with care</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <RotateCcw className="h-6 w-6 text-purple-600" />
          <div>
            <div className="font-medium text-gray-900">Easy Returns</div>
            <div className="text-sm text-gray-600">30-day return policy</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
