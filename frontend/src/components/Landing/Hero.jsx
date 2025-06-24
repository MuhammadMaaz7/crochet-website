"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Star, Heart } from "lucide-react"
import { useProduct } from "../../context/ProductContext"

export default function Hero() {
  const { featuredProducts, fetchFeaturedProducts } = useProduct()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(featuredProducts.length, 3))
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredProducts])

  const displayProducts = featuredProducts.slice(0, 3)

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-200 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                Handmade
              </span>
              <br />
              <span className="text-gray-800">with Love</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Discover our beautiful collection of handcrafted crochet items. Each piece is made with premium materials
              and endless love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/shop"
                className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">100+</div>
                <div className="text-gray-600">Unique Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">5★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Products Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {displayProducts.length > 0 && (
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentSlide ? 1 : 0,
                      scale: index === currentSlide ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="relative h-full bg-white rounded-2xl overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.svg?height=500&width=400"}
                        alt={product.name}
                        className="w-full h-3/4 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Product Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating?.average || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm">({product.rating?.count || 0} reviews)</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">${product.discountedPrice || product.price}</span>
                            {product.discountedPrice && product.discountedPrice < product.price && (
                              <span className="text-lg text-gray-300 line-through">${product.price}</span>
                            )}
                          </div>
                          <Link
                            to={`/products/${product._id}`}
                            className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-50 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Wishlist Button */}
                      <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="h-5 w-5 text-pink-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {displayProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -top-4 -left-4 w-20 h-20 bg-pink-200 rounded-full opacity-60"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -bottom-6 -right-6 w-16 h-16 bg-purple-200 rounded-full opacity-60"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
