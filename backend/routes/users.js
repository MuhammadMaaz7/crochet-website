import express from "express"
import { body } from "express-validator"
import { getUsers, getUserStats, getUser, updateUser, deleteUser } from "../controllers/userController.js"
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router()

// Validation rules
const userValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
]

// All routes require admin access
router.get("/", adminAuth, getUsers)
router.get("/stats", adminAuth, getUserStats)
router.get("/:id", adminAuth, getUser)
router.put("/:id", adminAuth, userValidation, updateUser)
router.delete("/:id", adminAuth, deleteUser)

export default router
