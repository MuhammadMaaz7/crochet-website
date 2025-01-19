import React from 'react';

export default function QuantitySelector({ quantity, onQuantityChange }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Quantity</h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="px-2 py-1 border rounded-md"
        >
          -
        </button>
        <span className="px-4 py-1 border rounded-md">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="px-2 py-1 border rounded-md"
        >
          +
        </button>
      </div>
    </div>
  );
}