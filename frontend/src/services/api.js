import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Important for cookies/sessions if you use them
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("user")
      window.location.href = "/login?session_expired=true"
    }
    else if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn("Rate limit exceeded, please slow down requests")
      // You could implement a retry mechanism here
      return Promise.reject({
        ...error,
        message: "Too many requests. Please wait before trying again."
      })
    }
    else if (error.code === "ERR_NETWORK") {
      // Network error (server down, CORS issue, etc.)
      console.error("Network error - check your connection or API server")
      return Promise.reject({
        ...error,
        message: "Network error. Please check your connection."
      })
    }
    return Promise.reject(error)
  }
)

// Helper function to handle API errors consistently
export function handleApiError(error) {
  console.error("API Error:", error)
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      "An unknown error occurred"
  return { error: true, message: errorMessage }
}

export default api