"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"

const ErrorDisplay = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto">
      {/* 404 Illustration */}
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <div className="text-9xl font-bold text-pink-300 mb-4">404</div>
        <div className="text-6xl mb-4">🧶</div>
      </motion.div>

      {/* Error Message */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Pacifico, cursive" }}>
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-2">Looks like this page got tangled up in our yarn!</p>
        <p className="text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors shadow-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </motion.button>
        </Link>

        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
          >
            Browse Products
          </motion.button>
        </Link>
      </motion.div>

      {/* Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center text-gray-600 hover:text-pink-600 transition-colors mx-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to previous page
        </button>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-20 left-10 text-pink-300 text-4xl opacity-50"
      >
        🧶
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-20 right-10 text-purple-300 text-3xl opacity-50"
      >
        ✂️
      </motion.div>
    </motion.div>
  )
}

export default ErrorDisplay
