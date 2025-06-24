"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Landing/Navbar"
import Footer from "../components/Landing/Footer"
import ShippingForm from "../components/checkout/ShippingForm"
import PaymentForm from "../components/checkout/PaymentForm"
import CheckoutSummary from "../components/checkout/CheckoutSummary"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../services/orderService"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const [loading, setLoading] = useState(false)
  const { items, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "cardNumber",
      "expiryDate",
      "cvv",
      "cardName",
    ]

    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setLoading(true)

    try {
      const orderData = {
        user: user._id, // Added user ID
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: { // Added billing address
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "credit_card",
        paymentDetails: {
          last4: formData.cardNumber.slice(-4),
          brand: "visa",
        },
        shippingMethod: "standard", // Added shipping method
      }

      const response = await createOrder(orderData)
      clearCart()
      toast.success("Order placed successfully!")
      navigate(`/profile?tab=orders`)
    } catch (error) {
      console.error("Order creation error:", error)
      if (error.response?.data?.error?.includes('orderNumber')) {
        toast.error("There was a problem processing your order. Please try again.")
      } else {
        toast.error(error.message || "Failed to place order. Please try again.")
      }
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Forms */}
              <div className="space-y-8">
                <ShippingForm formData={formData} onChange={handleChange} />
                <PaymentForm formData={formData} onChange={handleChange} />
              </div>

              {/* Right Column - Order Summary */}
              <CheckoutSummary
                cartItems={items.map((item) => ({
                  id: item.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.price,
                }))}
                subtotal={subtotal}
                tax={tax}
                total={total}
                loading={loading}
                onSubmit={handleSubmit}
              />
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
