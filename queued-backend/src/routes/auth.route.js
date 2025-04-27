
/**
 * Authentication Routes
 * 
 * API endpoints for user authentication and account management
 */
import express from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login an existing user
router.post('/login', authController.login);

// Get current authenticated user (protected route)
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
