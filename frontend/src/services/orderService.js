import api from './api.js'

// Get user orders
export const getUserOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

// Get all orders (Admin only)
export const getAllOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders/admin', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

// Get single order
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`)
    return response.data.order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

// Create new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to create order')
  }
}

// Update order status (Admin only)
export const updateOrderStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/orders/${id}/status`, statusData)
    return response.data
  } catch (error) {
    console.error('Error updating order status:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to update order status')
  }
}

// Cancel order
export const cancelOrder = async (id, reason) => {
  try {
    const response = await api.put(`/orders/${id}/cancel`, { reason })
    return response.data
  } catch (error) {
    console.error('Error cancelling order:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to cancel order')
  }
}
