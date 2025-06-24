"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useProduct } from "../../context/ProductContext"
import ProductCard from "../Products/ProductCard"

const RelatedProducts = ({ currentProductId, category }) => {
  const { products } = useProduct()
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      // Filter products by same category, excluding current product
      let filtered = products.filter(
        (p) => p._id !== currentProductId && p.category === category
      )

      // If not enough products in same category, add random products
      if (filtered.length < 4) {
        const otherProducts = products.filter(
          (p) => p._id !== currentProductId && p.category !== category
        )
        filtered = [...filtered, ...otherProducts].slice(0, 4)
      } else {
        filtered = filtered.slice(0, 4)
      }

      setRelatedProducts(filtered)
    }
  }, [products, currentProductId, category])

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800" style={{ fontFamily: "Pacifico, cursive" }}>
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RelatedProducts
