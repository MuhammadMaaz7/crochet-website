import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authService = {
  loginOrRegister: async (userData) => {
    const response = await api.post('/auth/login-register', userData);
    return response.data;
  },

  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};

export default api;

