import { validationResult } from "express-validator"
import Product from "../models/Product.js"

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    // Build filter object
    const filter = { isActive: true }

    if (req.query.category) {
      filter.category = req.query.category
    }

    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search }
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = Number.parseFloat(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = Number.parseFloat(req.query.maxPrice)
    }

    if (req.query.inStock === "true") {
      filter.stock = { $gt: 0 }
    }

    // Build sort object
    let sort = {}
    switch (req.query.sort) {
      case "price_asc":
        sort = { price: 1 }
        break
      case "price_desc":
        sort = { price: -1 }
        break
      case "rating":
        sort = { "rating.average": -1 }
        break
      case "newest":
        sort = { createdAt: -1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit).select("-reviews")

    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 8

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ "rating.average": -1, createdAt: -1 })
      .limit(limit)
      .select("-reviews")

    res.json({ products })
  } catch (error) {
    console.error("Get featured products error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("reviews.user", "name")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ product })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Ensure required fields are present
    const productData = {
      ...req.body,
      isActive: true,
      rating: {
        average: 0,
        count: 0
      },
      reviews: []
    }

    const product = await Product.create(productData)

    res.status(201).json({
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    console.error("Create product error:", error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => ({
          msg: err.message,
          param: err.path
        }))
      })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Soft delete - set isActive to false
    product.isActive = false
    await product.save()

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find((review) => review.user.toString() === req.user.id)

    if (existingReview) {
      return res.status(400).json({ message: "Product already reviewed" })
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    }

    product.reviews.push(review)

    // Update rating
    product.rating.count = product.reviews.length
    product.rating.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()

    res.status(201).json({ message: "Review added successfully" })
  } catch (error) {
    console.error("Add review error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
