import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import FilterSidebar from '../components/Products/FilterSidebar';
import ProductGrid from '../components/Products/ProductGrid';
import Pagination from '../components/Products/Pagination';
import { useProduct } from '../context/ProductContext';

export default function ProductsPage() {
  const { products, loading } = useProduct(); // Use the ProductContext
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Filter products based on selected category and price range
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = selectedPriceRange === 'all' || checkPriceRange(product.price, selectedPriceRange);
    return categoryMatch && priceMatch;
  });

  // Helper function to check if a product's price falls within the selected range
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
        {/* Page Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          Our Crochet Collection
        </motion.h1>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
          />

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} loading={loading} />
        </div>

        {/* Pagination */}
        <Pagination />
      </main>

      <Footer />
    </div>
  );
}