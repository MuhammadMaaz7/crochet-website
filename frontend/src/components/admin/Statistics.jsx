import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default function Statistics() {
  const stats = [
    { title: 'Total Revenue', value: '$10,245', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Products', value: '45', icon: Package, color: 'bg-blue-500' },
    { title: 'Orders', value: '124', icon: ShoppingCart, color: 'bg-yellow-500' },
    { title: 'Customers', value: '89', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

