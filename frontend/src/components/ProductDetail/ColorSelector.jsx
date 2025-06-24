"use client"
import { motion } from "framer-motion"

const ColorSelector = ({ colors, selectedColor, onSelectColor }) => {
  if (!colors || colors.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => onSelectColor(color)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-full border-4 transition-all ${
              selectedColor === color
                ? "border-pink-500 shadow-lg"
                : "border-white shadow-md hover:border-pink-300"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          >
            {selectedColor === color && (
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-medium capitalize">{selectedColor}</span>
        </p>
      )}
    </div>
  )
}

export default ColorSelector
