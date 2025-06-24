"use client"
import RegisterForm from "../components/auth/RegisterForm"

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
