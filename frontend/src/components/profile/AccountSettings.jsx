"use client"

const AccountSettings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Change Password</h3>
          <p className="text-gray-600 mb-4">Update your password to keep your account secure</p>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
            Change Password
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Email Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              Order updates
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              New product announcements
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Marketing emails
            </label>
          </div>
        </div>

        <div className="border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-red-600">Delete Account</h3>
          <p className="text-gray-600 mb-4">Permanently delete your account and all data</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
