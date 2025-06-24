"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { login as authLogin, register as authRegister, getCurrentUser, logout as authLogout } from "../services/authService"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 < Date.now()
    } catch (error) {
      return true
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)

          if (userData.token && !isTokenExpired(userData.token)) {
            // Set user from localStorage immediately
            setUser(userData)

            // Then verify with backend
            try {
              const response = await getCurrentUser()
              const updatedUser = {
                ...response.user,
                token: userData.token,
              }
              setUser(updatedUser)

              // Redirect admin to admin dashboard if not already there
              if (updatedUser.role === "admin" && !window.location.pathname.startsWith("/admin")) {
                navigate("/admin", { replace: true })
              }
            } catch (error) {
              console.error("Token verification failed:", error)
              await authLogout()
              setUser(null)
            }
          } else {
            await authLogout()
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        await authLogout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [navigate])

  const login = async (credentials) => {
    try {
      setError(null)
      const userData = await authLogin(credentials)
      const storedUser = JSON.parse(localStorage.getItem("user"))
      setUser(storedUser)
      
      // Return the user data for redirection logic
      return storedUser
    } catch (error) {
      setError(error.message)
      throw error
    }
  }
  

  const register = async (userData) => {
    try {
      setError(null)
      const response = await authRegister(userData)
      return response
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authLogout()
      setUser(null)
      setError(null)
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const isAdmin = () => {
    return user && user.role === "admin"
  }

  const isAuthenticated = () => {
    return user && user.token && !isTokenExpired(user.token)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAdmin,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}