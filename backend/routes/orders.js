import express from "express"
import { body } from "express-validator"
import {
  getUserOrders,
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router()

// Validation rules
const orderValidation = [
  body("user").optional().isMongoId().withMessage("Invalid user ID"),
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("shippingAddress.name").trim().notEmpty().withMessage("Shipping name is required"),
  body("shippingAddress.street").trim().notEmpty().withMessage("Shipping street is required"),
  body("shippingAddress.city").trim().notEmpty().withMessage("Shipping city is required"),
  body("shippingAddress.state").trim().notEmpty().withMessage("Shipping state is required"),
  body("shippingAddress.zipCode").trim().notEmpty().withMessage("Shipping zip code is required"),
  body("billingAddress").optional(),
  body("billingAddress.name").if(body('billingAddress').exists()).trim().notEmpty().withMessage("Billing name is required"),
  body("paymentMethod")
    .isIn(["credit_card", "debit_card", "paypal", "stripe", "cash_on_delivery"])
    .withMessage("Invalid payment method"),
  body("shippingMethod")
    .optional()
    .isIn(["standard", "express", "overnight", "pickup"])
    .withMessage("Invalid shipping method")
]
const statusValidation = [
  body("status")
    .isIn(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"])
    .withMessage("Invalid order status"),
]

// Routes
router.get("/", auth, getUserOrders)
router.get("/admin", adminAuth, getAllOrders)
router.get("/:id", auth, getOrder)
router.post("/", auth, orderValidation, createOrder)
router.put("/:id/status", adminAuth, statusValidation, updateOrderStatus)

export default router
