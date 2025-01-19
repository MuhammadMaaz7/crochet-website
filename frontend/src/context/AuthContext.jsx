import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check token expiry
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const isExpired = payload.exp * 1000 < Date.now();
      console.log('Token expiry check:', { isExpired, expiryTime: new Date(payload.exp * 1000) });
      return isExpired;
    } catch (error) {
      console.error('Token decoding error:', error);
      return true; // Invalid token
    }
  };

  // Restore user data on page reload
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored User:', storedUser); // Debugging
    if (storedUser && storedUser.token && !isTokenExpired(storedUser.token)) {
      setUser(storedUser);
    } else {
      localStorage.removeItem('user'); // Clear expired or invalid token
      setUser(null);
    }
    setLoading(false); // Set loading to false after restoring user state
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const userData = await authLogin(credentials);
      console.log('User Data after login:', userData); // Debugging
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const newUser = await authRegister(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await authLogout();
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};