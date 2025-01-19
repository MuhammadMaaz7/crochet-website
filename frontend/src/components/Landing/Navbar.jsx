import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X, Heart, User, LogOut } from 'lucide-react';
import AuthModal from '../AuthModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <>
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-40 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-pink-600"
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                CrochetCraft
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/shop" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
                Shop
              </Link>
              <Link to="/collections" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
                Collections
              </Link>
              <Link to="/patterns" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
                Patterns
              </Link>
              <Link to="/community" className="text-gray-600 hover:text-pink-500 transition-colors font-medium">
                Community
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2"
              >
                <Heart className="h-6 w-6 text-gray-600 hover:text-pink-500 transition-colors" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2"
              >
                <ShoppingBag className="h-6 w-6 text-gray-600 hover:text-pink-500 transition-colors" />
              </motion.button>
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-6 w-6 text-gray-600 hover:text-pink-500 transition-colors" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="h-6 w-6 text-gray-600 hover:text-pink-500 transition-colors" />
                </motion.button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              <Link to="/shop" className="block px-3 py-2 text-gray-600">
                Shop
              </Link>
              <Link to="/collections" className="block px-3 py-2 text-gray-600">
                Collections
              </Link>
              <Link to="/patterns" className="block px-3 py-2 text-gray-600">
                Patterns
              </Link>
              <Link to="/community" className="block px-3 py-2 text-gray-600">
                Community
              </Link>
              {user ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-600">
                  Logout
                </button>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="block w-full text-left px-3 py-2 text-gray-600">
                  Login / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}