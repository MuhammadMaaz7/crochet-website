import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/crochet-ecommerce")
    console.log("✅ Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@crochet.com" })
    if (existingAdmin) {
      console.log("❌ Admin user already exists")
      process.exit(1)
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@crochet.com",
      password: "admin123",
      role: "admin",
    })

    console.log("✅ Admin user created successfully")
    console.log("📧 Email: admin@crochet.com")
    console.log("🔑 Password: admin123")
    console.log("⚠️  Please change the password after first login")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
