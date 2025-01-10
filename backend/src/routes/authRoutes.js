import express from 'express';
const router = express.Router();
import { loginOrRegister, adminLogin, registerAdmin } from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

router.post('/login-register', loginOrRegister);
router.post('/admin/login', adminLogin);
router.post('/admin/register', protect, admin, registerAdmin);

// Use a default export for the router
export default router;
