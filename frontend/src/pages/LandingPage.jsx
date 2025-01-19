import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import ProductCard from '../components/Landing/ProductCard';
import Footer from '../components/Landing/Footer';
import { getProducts } from '../services/productService';
import { RibbonIcon as Yarn, Scissors, Gift, Home } from 'lucide-react';
import Spinner from '../components/Spinner'; // Import Spinner
import SkeletonLoader from '../components/SkeletonLoader'; // Import SkeletonLoader

const categories = [
  { id: 'all', name: 'All', icon: Yarn },
  { id: 'blankets', name: 'Blankets', icon: Home },
  { id: 'toys', name: 'Toys', icon: Gift },
  { id: 'accessories', name: 'Accessories', icon: Scissors },
];

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Collection Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            Our Lovely Collection
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Each piece is crafted with love and care, bringing warmth and charm to your home
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 transition-all duration-300 text-sm sm:text-base ${
                selectedCategory === category.id
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white text-gray-600 hover:bg-pink-100 hover:text-pink-500'
              }`}
            >
              <category.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading ? (
            // Use SkeletonLoader for a polished look
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div key={index} variants={item}>
                <SkeletonLoader />
              </motion.div>
            ))
          ) : (
            products.map((product) => (
              <motion.div key={product._id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}