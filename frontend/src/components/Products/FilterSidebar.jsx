"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"

const categories = [
  { id: "all", name: "All Products" },
  { id: "blankets", name: "Blankets" },
  { id: "toys", name: "Toys" },
  { id: "accessories", name: "Accessories" },
  { id: "home-decor", name: "Home Decor" },
  { id: "clothing", name: "Clothing" },
]

const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "under-25", name: "Under $25" },
  { id: "25-50", name: "$25 - $50" },
  { id: "50-100", name: "$50 - $100" },
  { id: "over-100", name: "Over $100" },
]

const sortOptions = [
  { id: "createdAt", name: "Newest First" },
  { id: "name", name: "Name A-Z" },
  { id: "price-asc", name: "Price: Low to High" },
  { id: "price-desc", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
]

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  sortBy,
  setSortBy,
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedPriceRange("all")
    setSortBy("createdAt")
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:border-pink-300 transition-colors"
        >
          <Filter className="w-5 h-5 text-pink-500" />
          <span>Filters</span>
        </motion.button>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={() => setShowFilters(!showFilters)} className="text-pink-500 focus:outline-none">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} md:block space-y-6`}>
          {/* Sort By */}
          {setSortBy && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-pink-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="mr-3 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 hover:text-pink-600 transition-colors">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.id} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={() => setSelectedPriceRange(range.id)}
                    className="mr-3 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 hover:text-pink-600 transition-colors">{range.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <motion.button
            onClick={clearFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors font-medium"
          >
            Clear All Filters
          </motion.button>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar
