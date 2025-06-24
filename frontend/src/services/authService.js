import api from "./api.js"

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials)
    const userData = response.data

    if (userData.token) {
      // Store complete user data with token
      const userToStore = {
        ...userData.user,
        token: userData.token,
      }
      localStorage.setItem("user", JSON.stringify(userToStore))
      return userToStore  // Return the stored user data
    }
    throw new Error("No token received")
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

// Register user (explicitly prevent admin registration)
export const register = async (userData) => {
  try {
    // Ensure no one can register as admin
    if (userData.role === "admin") {
      throw new Error("Admin registration not allowed")
    }

    const response = await api.post("/auth/register", {
      ...userData,
      role: "user" // Force role to be user
    })
    return response.data
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me")
    return response.data
  } catch (error) {
    console.error("Get current user error:", error.response?.data || error.message)
    throw error
  }
}

// Logout user
export const logout = async () => {
  try {
    // Call the logout endpoint
    await api.post('/auth/logout')
    
    // Remove user from localStorage
    localStorage.removeItem("user")
  } catch (error) {
    console.error("Logout error:", error)
    // Even if the logout API fails, we still want to clear local storage
    localStorage.removeItem("user")
    throw error
  }
}

// Update profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData)
    return response.data
  } catch (error) {
    console.error("Update profile error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Profile update failed")
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put("/auth/change-password", passwordData)
    return response.data
  } catch (error) {
    console.error("Change password error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Password change failed")
  }
}

