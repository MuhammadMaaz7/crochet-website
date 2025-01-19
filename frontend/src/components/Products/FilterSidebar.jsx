import { useState } from 'react';
import { Filter } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'blankets', name: 'Blankets' },
  { id: 'toys', name: 'Toys' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'home-decor', name: 'Home Decor' },
];

const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-25', name: 'Under $25' },
  { id: '25-50', name: '$25 - $50' },
  { id: '50-100', name: '$50 - $100' },
  { id: 'over-100', name: 'Over $100' },
];

export default function FilterSidebar({ selectedCategory, setSelectedCategory, selectedPriceRange, setSelectedPriceRange }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-pink-500 focus:outline-none"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Categories</h3>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center mb-2">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="mr-2 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          {priceRanges.map((range) => (
            <label key={range.id} className="flex items-center mb-2">
              <input
                type="radio"
                name="priceRange"
                value={range.id}
                checked={selectedPriceRange === range.id}
                onChange={() => setSelectedPriceRange(range.id)}
                className="mr-2 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">{range.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}