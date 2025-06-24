"use client"

import { createContext, useState, useEffect, useContext } from "react"
import {
  getProducts,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService"

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts(params)
      setProducts(data.products || [])
      return data
    } catch (error) {
      setError(error.message)
      console.error("Error fetching products:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts()
      setFeaturedProducts(data.products || [])
      return data
    } catch (error) {
      console.error("Error fetching featured products:", error)
      throw error
    }
  }

  // Add a new product
  const addProduct = async (productData) => {
    try {
      setError(null)
      const response = await createProduct(productData)
      const newProduct = response.product
      setProducts((prevProducts) => [...prevProducts, newProduct])
      return newProduct
    } catch (error) {
      setError(error.message)
      console.error("Error adding product:", error)
      throw error
    }
  }

  // Update a product
  const editProduct = async (id, productData) => {
    try {
      setError(null)
      const response = await updateProduct(id, productData)
      const updatedProduct = response.product
      setProducts((prevProducts) => prevProducts.map((product) => (product._id === id ? updatedProduct : product)))
      return updatedProduct
    } catch (error) {
      setError(error.message)
      console.error("Error updating product:", error)
      throw error
    }
  }

  // Delete a product
  const removeProduct = async (id) => {
    try {
      setError(null)
      await deleteProduct(id)
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id))
    } catch (error) {
      setError(error.message)
      console.error("Error deleting product:", error)
      throw error
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Load initial data
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const value = {
    products,
    featuredProducts,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    addProduct,
    editProduct,
    removeProduct,
    clearError,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}
