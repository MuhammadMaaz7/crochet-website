"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-pink-100 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="text-center md:text-left lg:col-span-1">
            <motion.h3
              className="text-2xl font-bold text-pink-600 mb-4"
              style={{ fontFamily: "Pacifico, cursive" }}
              whileHover={{ scale: 1.05 }}
            >
              CrochetCraft
            </motion.h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Handmade with love, bringing warmth and joy to your everyday life. Each piece tells a story of
              craftsmanship and dedication.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-pink-500 mb-4">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm">Made with love since 2020</span>
            </div>
            <div className="flex justify-center md:justify-start space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-pink-50 hover:shadow-md transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-pink-500" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "FAQ", path: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Blankets & Throws", "Toys & Amigurumi", "Accessories", "Home Decor", "Baby Items"].map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 hover:text-pink-500 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Stay Connected</h4>
            <p className="text-gray-600 mb-4 text-sm">Stay up to date with our latest news and products.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0 mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-pink-600 transition-colors whitespace-nowrap text-sm font-medium"
              >
                Subscribe
              </button>
            </form>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <span className="text-gray-600 text-sm">hello@crochetcraft.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-pink-500" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-gray-600 text-sm">New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-pink-200 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© {currentYear} CrochetCraft. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-600 hover:text-pink-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-pink-500 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
