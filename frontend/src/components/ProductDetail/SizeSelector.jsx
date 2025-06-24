"use client"
import { motion } from "framer-motion"

const SizeSelector = ({ sizes, selectedSize, onSelectSize }) => {
  if (!sizes || sizes.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, index) => (
          <motion.button
            key={index}
            onClick={() => onSelectSize(size)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
              selectedSize === size
                ? "border-pink-500 bg-pink-500 text-white shadow-lg"
                : "border-gray-300 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50"
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
      {selectedSize && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedSize}</span>
        </p>
      )}
    </div>
  )
}

export default SizeSelector
