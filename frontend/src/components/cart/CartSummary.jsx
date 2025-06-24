"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const CartSummary = ({ subtotal, shipping, tax, total }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-fit">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {shipping > 0 && (
        <p className="text-sm text-gray-600 mb-4">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/checkout"
          className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors text-center block"
        >
          Proceed to Checkout
        </Link>
      </motion.div>
    </div>
  )
}

export default CartSummary
