import React from 'react';
import { motion } from 'framer-motion';
import { Package, PlusCircle, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { toast } from 'react-toastify';

export default function Sidebar({ setActiveComponent }) {
  const { logout } = useAuth(); // Access the logout function

  const menuItems = [
    { name: 'Products', icon: Package, action: () => setActiveComponent('products') },
    { name: 'Add Product', icon: PlusCircle, action: () => setActiveComponent('add-product') },
    { name: 'Statistics', icon: BarChart2, action: () => setActiveComponent('statistics') },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Brand Logo */}
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-pink-600">CrochetCraft</h1>
      </div>

      {/* Menu Items */}
      <ul className="flex flex-col py-4">
        {menuItems.map((item, index) => (
          <motion.li
            key={item.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
              onClick={item.action}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <item.icon size={20} />
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          </motion.li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-gray-800"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );
}