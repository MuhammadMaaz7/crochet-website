"use client"
import { User, Package, Heart, Settings } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth()

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "orders", name: "Orders", icon: Package },
    { id: "wishlist", name: "Wishlist", icon: Heart },
    { id: "settings", name: "Settings", icon: Settings },
  ]

  return (
    <div className="md:w-1/4 bg-gray-50 p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-pink-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              activeTab === tab.id ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="mr-3 h-5 w-5" />
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ProfileSidebar
