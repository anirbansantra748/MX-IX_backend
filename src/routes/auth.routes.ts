import { Router } from 'express';
import { login, getCurrentUser, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/password', authMiddleware, changePassword);

export default router;
