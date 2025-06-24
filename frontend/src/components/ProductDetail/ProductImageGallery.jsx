"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const ProductImageGallery = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Ensure images is an array and handle different image formats
  const imageList = Array.isArray(images) 
    ? images.map(img => typeof img === 'string' ? img : img.url)
    : ["/placeholder.svg?height=600&width=600"]

  const nextImage = () => {
    setCurrentImage((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 relative">
          <motion.img
            key={currentImage}
            src={imageList[currentImage] || "/placeholder.svg"}
            alt={`Product image ${currentImage + 1}`}
            className="w-full h-full object-contain absolute inset-0 cursor-zoom-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsZoomed(true)}
          />
          
          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <motion.button
                onClick={prevImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </motion.button>
              <motion.button
                onClick={nextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </motion.button>
            </>
          )}

          {/* Zoom Icon */}
          <motion.button
            onClick={() => setIsZoomed(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ZoomIn className="w-5 h-5 text-gray-800" />
          </motion.button>

          {/* Image Counter */}
          {imageList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImage + 1} / {imageList.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {imageList.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imageList.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImage(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                currentImage === index ? "ring-2 ring-pink-500 ring-offset-2" : "hover:ring-2 hover:ring-pink-300"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {currentImage === index && (
                <div className="absolute inset-0 bg-pink-500/20" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageList[currentImage] || "/placeholder.svg"}
              alt={`Product image ${currentImage + 1} - Zoomed`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6 transform rotate-45" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ProductImageGallery
