import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage'; // Import the new component
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ProductPage />} />

        {/* Product detail route */}
        <Route path="/shop/:productId" element={<ProductDetailPage />} />

        {/* Protected route for admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;