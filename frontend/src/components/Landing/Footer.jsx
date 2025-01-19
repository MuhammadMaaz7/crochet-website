import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-pink-100 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-pink-600 mb-4">
              CrochetCraft
            </h3>
            <p className="text-gray-600 mb-4">
              Handmade with love, bringing warmth and joy to your everyday life.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Newsletter</h4>
            <p className="text-gray-600 mb-4">Stay up to date with our latest news and products.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-pink-500 text-white px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-pink-600 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-pink-200 text-center">
          <p className="text-gray-600">&copy; 2024 CrochetCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}