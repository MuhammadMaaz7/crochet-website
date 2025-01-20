import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { ChromePicker } from 'react-color'; // For color picker

export default function ProductForm({ product, onClose = () => {} }) {
  const { addProduct, editProduct } = useProduct();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
    colors: [],
    rating: 0,
    stock: 0,
  });
  const [errors, setErrors] = useState({}); // For validation errors
  const [showColorPicker, setShowColorPicker] = useState(false); // For color picker

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Clear errors when the user starts typing
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    const newArray = value.split(',').map(item => item.trim());
    setFormData(prevState => ({
      ...prevState,
      [field]: newArray,
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prevState => ({
      ...prevState,
      colors: [...prevState.colors, color.hex],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Price validation
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Stock validation
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    // Rating validation
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    // Images validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      console.error('No user or token found');
      return;
    }

    if (!validateForm()) {
      return; // Stop submission if there are validation errors
    }

    try {
      if (product) {
        await editProduct(product._id, formData, user.token);
      } else {
        await addProduct(formData, user.token);
      }
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors({ submit: 'Failed to submit product. Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter product name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter product description"
              required
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter product price"
              required
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a category</option>
              <option value="blankets">Blankets</option>
              <option value="toys">Toys</option>
              <option value="accessories">Accessories</option>
              <option value="home">Home Decor</option>
            </select>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
            <input
              type="text"
              id="images"
              name="images"
              value={formData.images.join(', ')}
              onChange={(e) => handleArrayChange(e, 'images')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="e.g., /image1.jpg, /image2.jpg"
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            {formData.images[0] && (
              <div className="mt-2">
                <img
                  src={formData.images[0]}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Colors */}
          <div>
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
            <div className="flex items-center space-x-2">
              {formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="px-2 py-1 bg-pink-500 text-white rounded-md"
              >
                Add Color
              </button>
            </div>
            {showColorPicker && (
              <ChromePicker
                color="#ffffff"
                onChangeComplete={handleColorChange}
              />
            )}
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter product rating (0-5)"
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter product stock"
              required
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              {product ? 'Update Product' : 'Add Product'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}