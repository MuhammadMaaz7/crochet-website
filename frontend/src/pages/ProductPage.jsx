// pages/ProductsPage.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import ProductCard from '../components/Landing/ProductCard';
import Footer from '../components/Landing/Footer';
import { getProducts } from '../services/productService';
import Spinner from '../components/Spinner';

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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = selectedPriceRange === 'all' || checkPriceRange(product.price, selectedPriceRange);
    return categoryMatch && priceMatch;
  });

  const checkPriceRange = (price, range) => {
    switch (range) {
      case 'under-25':
        return price < 25;
      case '25-50':
        return price >= 25 && price < 50;
      case '50-100':
        return price >= 50 && price < 100;
      case 'over-100':
        return price >= 100;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          Our Crochet Collection
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md"
          >
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
          </motion.div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronUp className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-pink-50 border-pink-500 text-pink-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}