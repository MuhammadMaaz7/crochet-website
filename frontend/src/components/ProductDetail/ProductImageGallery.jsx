import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="relative">
      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
        <img
          src={images[currentImage] || "/placeholder.svg"}
          alt="Product"
          className="w-full h-full object-center object-cover"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-between">
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
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
              currentImage === index ? 'ring-2 ring-pink-500' : ''
            }`}
          >
            <img src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} className="w-full h-full object-center object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}