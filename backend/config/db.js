import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log("Connecting to DB:", process.env.MONGO_URI) // Debug check
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
