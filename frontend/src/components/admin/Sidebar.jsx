"use client"
import { motion } from "framer-motion"
import { Package, PlusCircle, BarChart2, LogOut, Users, ShoppingCart } from 'lucide-react'
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { name: "Statistics", icon: BarChart2, action: () => setActiveComponent("statistics") },
    { name: "Products", icon: Package, action: () => setActiveComponent("products") },
    { name: "Add Product", icon: PlusCircle, action: () => setActiveComponent("add-product") },
    { name: "Orders", icon: ShoppingCart, action: () => setActiveComponent("orders") },
    { name: "Users", icon: Users, action: () => setActiveComponent("users") },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg h-full">
      {/* Brand Logo */}
      <div className="flex items-center justify-center h-20 shadow-md bg-gradient-to-r from-pink-500 to-purple-600">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Pacifico, cursive" }}>
          CrochetCraft
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={item.action}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                  activeComponent === item.name.toLowerCase().replace(" ", "-")
                    ? "bg-pink-50 text-pink-600 border-r-4 border-pink-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  )
}

export default Sidebar
