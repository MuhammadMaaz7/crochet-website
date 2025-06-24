"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useProduct } from "../../context/ProductContext"
import { X, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const ProductForm = ({ product, onClose = () => {} }) => {
  const { addProduct, editProduct } = useProduct()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: "",
    subcategory: "",
    images: [],
    colors: [],
    sizes: [],
    materials: [],
    careInstructions: "",
    stock: 0,
    isFeatured: false,
    tags: [],
  })
  const [errors, setErrors] = useState({})
  const [newColor, setNewColor] = useState("#ff69b4")
  const [newSize, setNewSize] = useState("")
  const [newMaterial, setNewMaterial] = useState("")
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discountedPrice: product.discountedPrice || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        images: product.images?.map((img) => (typeof img === "string" ? img : img.url)) || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        materials: product.materials || [],
        careInstructions: product.careInstructions || "",
        stock: product.stock || 0,
        isFeatured: product.isFeatured || false,
        tags: product.tags || [],
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
  }

  const handleImageChange = (e) => {
    const { value } = e.target
    const newImages = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prevState) => ({
      ...prevState,
      images: newImages,
    }))
  }

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData((prevState) => ({
        ...prevState,
        colors: [...prevState.colors, newColor],
      }))
      setNewColor("#ff69b4")
    }
  }

  const removeColor = (colorToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      colors: prevState.colors.filter((color) => color !== colorToRemove),
    }))
  }

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData((prevState) => ({
        ...prevState,
        sizes: [...prevState.sizes, newSize],
      }))
      setNewSize("")
    }
  }

  const removeSize = (sizeToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      sizes: prevState.sizes.filter((size) => size !== sizeToRemove),
    }))
  }

  const addMaterial = () => {
    if (newMaterial && !formData.materials.includes(newMaterial)) {
      setFormData((prevState) => ({
        ...prevState,
        materials: [...prevState.materials, newMaterial],
      }))
      setNewMaterial("")
    }
  }

  const removeMaterial = (materialToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      materials: prevState.materials.filter((material) => material !== materialToRemove),
    }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.discountedPrice && formData.discountedPrice >= formData.price) {
      newErrors.discountedPrice = "Discounted price must be less than regular price"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative"
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image URL is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the validation errors")
      return
    }

    setLoading(true)
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.discountedPrice 
          ? Number(formData.discountedPrice)
          : Number(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        images: formData.images.map(url => ({ url, alt: formData.name })),
        colors: formData.colors.map(hex => ({ name: `Color-${hex}`, hex, available: true })),
        sizes: formData.sizes.map(size => ({ name: size, measurements: "", available: true })),
        materials: formData.materials,
        careInstructions: formData.careInstructions,
        stock: Number(formData.stock),
        isFeatured: formData.isFeatured,
        tags: formData.tags,
        isActive: true
      }

      if (product) {
        await editProduct(product._id, submitData)
        toast.success("Product updated successfully!")
      } else {
        await addProduct(submitData)
        toast.success("Product added successfully!")
      }
      onClose()
    } catch (error) {
      console.error("Error submitting product:", error)
      toast.error(error.message || "Failed to submit product. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                placeholder="Enter product name"
                required
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                placeholder="0.00"
                required
                disabled={loading}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discounted Price */}
            <div>
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Discounted Price ($)
              </label>
              <input
                type="number"
                id="discountedPrice"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                placeholder="0.00"
                disabled={loading}
              />
              {errors.discountedPrice && <p className="text-red-500 text-sm mt-1">{errors.discountedPrice}</p>}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                placeholder="0"
                required
                disabled={loading}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
              placeholder="Enter product description"
              required
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="bags">Bags</option>
                <option value="blanket">Blanket</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="home-decor">Home Decor</option>
                <option value="toys">Toys</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                placeholder="Enter subcategory"
                disabled={loading}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (comma-separated) *
            </label>
            <input
              type="text"
              id="images"
              name="images"
              value={formData.images.join(", ")}
              onChange={handleImageChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              disabled={loading}
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            {formData.images.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
                {formData.images.length > 3 && (
                  <div className="w-20 h-20 bg-gray-100 rounded-md border flex items-center justify-center text-sm text-gray-500">
                    +{formData.images.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="relative">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Add Color
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.sizes.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="e.g., Small, Medium, Large"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Add Size
              </button>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Materials</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.materials.map((material, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {material}
                  <button
                    type="button"
                    onClick={() => removeMaterial(material)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="e.g., Cotton, Wool, Acrylic"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Add Material
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., handmade, cozy, gift"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Care Instructions */}
          <div>
            <label htmlFor="careInstructions" className="block text-sm font-medium text-gray-700 mb-2">
              Care Instructions
            </label>
            <textarea
              id="careInstructions"
              name="careInstructions"
              value={formData.careInstructions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors"
              placeholder="e.g., Hand wash only, lay flat to dry"
              disabled={loading}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default ProductForm
