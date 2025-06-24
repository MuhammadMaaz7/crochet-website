"use client"
import ErrorDisplay from "../components/error/ErrorDisplay"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <ErrorDisplay />
    </div>
  )
}

export default NotFoundPage
