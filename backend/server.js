import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import DB connection
import connectDB from './config/db.js'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import userRoutes from './routes/users.js'

// Import middleware
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'

const app = express()

// Connect to MongoDB
await connectDB()
console.log(`📊 Database: ${mongoose.connection.name}`)

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}))

// CORS configuration - must come before other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200
  })
)

// Handle preflight requests for all routes
app.options('*', cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "API is healthy!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  })
})

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    version: "1.0.0",
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📡 API URL: http://localhost:${PORT}/api`)
  console.log(`🖥️  Allowed Origin: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received")
  mongoose.connection.close(() => {
    console.log("📊 Database connection closed")
    process.exit(0)
  })
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

export default app