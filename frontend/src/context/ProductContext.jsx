import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // Add a new product
  const addProduct = async (productData, token) => {
    try {
      const newProduct = await createProduct(productData, token);
      setProducts([...products, newProduct]); // Update the state
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // Update a product
  const editProduct = async (id, productData, token) => {
    try {
      const updatedProduct = await updateProduct(id, productData, token);
      setProducts(
        products.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Delete a product
  const removeProduct = async (id, token) => {
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};