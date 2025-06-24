"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Landing/Navbar"
import Footer from "../components/Landing/Footer"
import ProductImageGallery from "../components/ProductDetail/ProductImageGallery"
import ProductInfo from "../components/ProductDetail/ProductInfo"
import RelatedProducts from "../components/ProductDetail/RelatedProducts"
import { getProductById } from "../services/productService"
import Spinner from "../components/Spinner"

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductById(productId)
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Product not found")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-16"
        >
          {/* Product Images */}
          <ProductImageGallery images={product.images} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </motion.div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product._id} category={product.category} />
      </main>

      <Footer />
    </div>
  )
}
