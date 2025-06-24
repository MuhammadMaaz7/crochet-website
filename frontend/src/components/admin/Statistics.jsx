"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react'
import { useProduct } from "../../context/ProductContext"

const Statistics = ({ setActiveComponent }) => {  // Add setActiveComponent as prop
  const { products } = useProduct()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
  })

  useEffect(() => {
    // Calculate statistics from products
    const totalProducts = products.length
    const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0)

    setStats((prev) => ({
      ...prev,
      totalProducts,
      totalRevenue,
      totalOrders: 124, // Mock data
      totalCustomers: 89, // Mock data
    }))
  }, [products])


  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      growth: stats.revenueGrowth,
      isPositive: true,
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-blue-500",
      growth: 5.2,
      isPositive: true,
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-yellow-500",
      growth: stats.ordersGrowth,
      isPositive: true,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-purple-500",
      growth: -2.1,
      isPositive: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Statistics</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>

            {/* Growth Indicator */}
            <div className="mt-4 flex items-center">
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1">{Math.abs(stat.growth)}%</span>
              </div>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
            onClick={() => setActiveComponent("add-product")}  // Add onClick handler
          >
            <Package className="w-8 h-8 text-pink-600 mb-2" />
            <div className="text-left">
              <div className="font-semibold text-gray-800">Add New Product</div>
              <div className="text-sm text-gray-600">Create a new crochet item</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            onClick={() => setActiveComponent("orders")}  // Add onClick handler
          >
            <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-left">
              <div className="font-semibold text-gray-800">View Orders</div>
              <div className="text-sm text-gray-600">Manage customer orders</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
            onClick={() => setActiveComponent("users")}  // Add onClick handler
          >
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-left">
              <div className="font-semibold text-gray-800">Customer Management</div>
              <div className="text-sm text-gray-600">View customer details</div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "New order received", time: "2 minutes ago", type: "order" },
            { action: "Product 'Cozy Blanket' updated", time: "1 hour ago", type: "product" },
            { action: "New customer registered", time: "3 hours ago", type: "customer" },
            { action: "Order #1234 shipped", time: "5 hours ago", type: "shipping" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === "order"
                      ? "bg-green-500"
                      : activity.type === "product"
                      ? "bg-blue-500"
                      : activity.type === "customer"
                      ? "bg-purple-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span className="text-gray-800">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Statistics
