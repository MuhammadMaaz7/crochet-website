"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductProvider } from "../context/ProductContext"
import Sidebar from "../components/admin/Sidebar"
import ProductList from "../components/admin/ProductList"
import ProductForm from "../components/admin/ProductForm"
import Statistics from "../components/admin/Statistics"
import OrderManagement from "../components/admin/OrderManagement"
import UserManagement from "../components/admin/UserManagement"

export default function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState("statistics")

  const renderComponent = () => {
    switch (activeComponent) {
      case "statistics":
        return <Statistics setActiveComponent={setActiveComponent} />
      case "products":
        return <ProductList />
      case "add-product":
        return <ProductForm onClose={() => setActiveComponent("products")} />
      case "orders":
        return <OrderManagement />
      case "users":
        return <UserManagement />
      default:
        return <Statistics />
    }
  }

  return (
    <ProductProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <motion.h1
              className="text-3xl font-semibold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Admin Dashboard
            </motion.h1>
            {renderComponent()}
          </div>
        </main>
      </div>
    </ProductProvider>
  )
}
