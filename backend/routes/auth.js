import express from "express"
import { body } from "express-validator"
import { register, login, getMe, updateProfile, changePassword, logout } from "../controllers/authController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

const profileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("phone").optional().trim().isMobilePhone().withMessage("Please enter a valid phone number"),
]

const passwordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
]

// Routes
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.post("/logout", auth, logout) // Add this line
router.get("/me", auth, getMe)
router.put("/profile", auth, profileValidation, updateProfile)
router.put("/change-password", auth, passwordValidation, changePassword)

export default router
