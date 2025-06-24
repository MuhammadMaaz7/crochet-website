import auth from "./auth.js"

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next()
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." })
    }
  })
}

export default adminAuth
