"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Landing/Navbar"
import Footer from "../components/Landing/Footer"
import ProfileSidebar from "../components/profile/ProfileSidebar"
import ProfileInfo from "../components/profile/ProfileInfo"
import OrderHistory from "../components/profile/OrderHistory"
import Wishlist from "../components/profile/Wishlist"
import AccountSettings from "../components/profile/AccountSettings"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile")

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />
      case "orders":
        return <OrderHistory />
      case "wishlist":
        return <Wishlist />
      case "settings":
        return <AccountSettings />
      default:
        return <ProfileInfo />
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
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 p-6">{renderContent()}</div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage
