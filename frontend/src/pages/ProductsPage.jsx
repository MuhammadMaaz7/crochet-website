"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Landing/Navbar"
import Footer from "../components/Landing/Footer"
import FilterSidebar from "../components/Products/FilterSidebar"
import ProductGrid from "../components/Products/ProductGrid"
import Pagination from "../components/Products/Pagination"
import { getProducts } from "../services/productService"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("createdAt")

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedPriceRange, currentPage, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory
      }

      if (selectedPriceRange !== "all") {
        const [min, max] = getPriceRange(selectedPriceRange)
        if (min) params.minPrice = min
        if (max) params.maxPrice = max
      }

      const data = await getProducts(params)
      setProducts(data.products || data)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriceRange = (range) => {
    switch (range) {
      case "under-25":
        return [null, 25]
      case "25-50":
        return [25, 50]
      case "50-100":
        return [50, 100]
      case "over-100":
        return [100, null]
      default:
        return [null, null]
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Page Heading */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Pacifico, cursive" }}>
            Our Crochet Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our beautiful handmade crochet items, each crafted with love and attention to detail
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
