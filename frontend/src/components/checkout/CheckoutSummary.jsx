"use client"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

const CheckoutSummary = ({ cartItems, subtotal, tax, total, loading, onSubmit }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-fit">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
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

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        type="submit"
        disabled={loading}
        onClick={onSubmit}
        className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Lock className="mr-2 h-5 w-5" />
        {loading ? "Processing..." : "Place Order"}
      </motion.button>

      <p className="text-xs text-gray-500 mt-3 text-center">Your payment information is secure and encrypted</p>
    </div>
  )
}

export default CheckoutSummary
