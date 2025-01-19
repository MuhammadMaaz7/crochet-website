import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';

export default function ProductInfo({ product }) {
  // Ensure product and its properties are defined
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log('Added to cart:', { ...product, color: selectedColor, size: selectedSize, quantity });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Pacifico, cursive' }}>
        {product.name}
      </h1>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < Math.floor(product.rating || 0)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">({product.rating || 0})</span>
      </div>
      <p className="text-2xl font-semibold mb-4">${product.price?.toFixed(2) || '0.00'}</p>
      <p className="text-gray-600 mb-6">{product.description || 'No description available.'}</p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <ColorSelector
          colors={product.colors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />
      )}

      {/* Quantity Selection */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* Add to Cart and Wishlist */}
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-600 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 inline-block mr-2" />
          Add to Cart
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-md border border-pink-500 text-pink-500 font-medium hover:bg-pink-50 transition-colors"
        >
          <Heart className="w-5 h-5 inline-block" />
        </motion.button>
      </div>
    </div>
  );
}