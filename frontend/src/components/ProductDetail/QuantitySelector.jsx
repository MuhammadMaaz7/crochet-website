"use client"
import { motion } from "framer-motion"
import { Minus, Plus } from 'lucide-react'

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity = 99 }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1
    if (value >= 1 && value <= maxQuantity) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Quantity</h3>
      <div className="flex items-center space-x-3">
        <motion.button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
          whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-300 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
        />
        
        <motion.button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          whileHover={{ scale: quantity < maxQuantity ? 1.1 : 1 }}
          whileTap={{ scale: quantity < maxQuantity ? 0.9 : 1 }}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-300 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
      
      {maxQuantity < 99 && (
        <p className="text-sm text-gray-600">
          Maximum available: {maxQuantity}
        </p>
      )}
    </div>
  )
}

export default QuantitySelector
