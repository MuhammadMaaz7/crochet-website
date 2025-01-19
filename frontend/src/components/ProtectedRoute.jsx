import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // If still loading, show a loading indicator or nothing
  if (loading) {
    return null; // Or return a loading spinner
  }

  // If user is not logged in, redirect to home page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If role is specified and user does not have the required role, redirect to home page
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // If user is authenticated and has the required role, render the children
  return children;
};

export default ProtectedRoute;