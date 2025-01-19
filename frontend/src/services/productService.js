import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single product by ID
const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new product
const createProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log('Token in request headers:', config.headers.Authorization); // Debugging
    const response = await axios.post(API_URL, productData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw error;
  }
};



// Update a product
const updateProduct = async (id, productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log('Token in request headers:', config.headers.Authorization); // Debugging
    const response = await axios.put(`${API_URL}/${id}`, productData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message);
    throw error;
  }
};


// Delete a product
const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log('Token in delete request headers:', config.headers.Authorization); // Debugging
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response?.data || error.message);
    throw error;
  }
};

export {
  getProducts, // Export getProducts instead of fetchProducts
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};