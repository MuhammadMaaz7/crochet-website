import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Login user
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Logout user
const logout = async () => {
  // If your backend requires a logout API call, you can add it here
  // Example: await axios.post(`${API_URL}/logout`);
  localStorage.removeItem('user'); // Clear user data from localStorage
};

export { login, register, logout };