import api from "./api.js"

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const API_URL = `${BASE_API_URL}/products`

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get("/products", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await api.get("/products/featured", { params: { limit } })
    return response.data
  } catch (error) {
    console.error("Error fetching featured products:", error)
    throw error
  }
}

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data.product
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

// Create a new product (Admin only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to create product")
  }
}

// Update a product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to update product")
  }
}

// Delete a product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to delete product")
  }
}

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  } catch (error) {
    console.error("Error adding review:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to add review")
  }
}

// Search products
export const searchProducts = async (query, filters = {}) => {
  try {
    const params = { search: query, ...filters }
    const response = await api.get("/products", { params })
    return response.data
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}
