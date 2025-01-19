import React from 'react';

export default function ColorSelector({ colors, selectedColor, onSelectColor }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Color</h3>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
              selectedColor === color ? 'ring-2 ring-pink-500' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}