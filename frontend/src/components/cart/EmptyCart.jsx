"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingBag, ArrowLeft } from "lucide-react"

const EmptyCart = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Continue Shopping
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default EmptyCart
