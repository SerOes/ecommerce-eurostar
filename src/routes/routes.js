import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { checkoutController } from '../controllers/checkoutController.js';
import { systemController } from '../controllers/systemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/healthcheck', systemController.healthcheck);

// Protected routes
router.post('/checkout', authMiddleware, checkoutController.checkout);

export default router;
