import React from 'react';

export default function SizeSelector({ sizes, selectedSize, onSelectSize }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Size</h3>
      <div className="flex space-x-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              selectedSize === size
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}