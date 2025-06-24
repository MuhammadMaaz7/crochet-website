import express from "express"
import { body } from "express-validator"
import {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} from "../controllers/productController.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router()

// Validation rules
const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required")
    .isLength({ max: 100 }).withMessage("Product name cannot be more than 100 characters"),
  body("description").trim().notEmpty().withMessage("Description is required")
    .isLength({ max: 2000 }).withMessage("Description cannot be more than 2000 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("originalPrice").optional().isFloat({ min: 0 }).withMessage("Original price must be positive"),
  body("category")
  .isIn(["bags", "clothing", "accessories", "home-decor", "toys", "other", "blankets"])
  .withMessage("Invalid category"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("images").isArray({ min: 1 }).withMessage("At least one image is required"),
  body("images.*.url").isURL().withMessage("Image URL must be valid"),
  body("colors").optional().isArray(),
  body("sizes").optional().isArray(),
  body("materials").optional().isArray()
]

const reviewValidation = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
]

// Public routes
router.get("/", getProducts)
router.get("/featured", getFeaturedProducts)
router.get("/:id", getProduct)

// Private routes
router.post("/:id/reviews", auth, reviewValidation, addReview)

// Admin routes
router.post("/", adminAuth, productValidation, createProduct)
router.put("/:id", adminAuth, productValidation, updateProduct)
router.delete("/:id", adminAuth, deleteProduct)

export default router
