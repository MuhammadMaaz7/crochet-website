"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductImageGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="relative">
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 relative">
        <img
          src={images[currentImage] || "/placeholder.svg"}
          alt="Product"
          className="w-full h-full object-contain absolute inset-0"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-full pb-[100%] relative rounded-md overflow-hidden bg-gray-100 ${
              currentImage === index ? "ring-2 ring-pink-500" : ""
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

