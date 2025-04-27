/**
 * Authentication Middleware
 * 
 * Middleware functions for protecting routes and verifying user authentication
 */
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { AuthenticationError } from '../utils/errors';

/**
 * Middleware to verify user is authenticated with a valid JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided, authorization denied');
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Invalid token format, authorization denied');
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const result = await db.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0) {
        throw new AuthenticationError('User not found');
      }
      
      // Attach user to request
      req.user = result.rows[0];
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        throw new AuthenticationError('Invalid or expired token');
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify if user is room creator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isRoomCreator = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id || req.params.roomId;
    
    const result = await db.query(
      'SELECT * FROM rooms WHERE id = $1 AND creator_id = $2',
      [roomId, userId]
    );
    
    if (result.rows.length === 0) {
      throw new AuthenticationError('Unauthorized access - only room creator can perform this action');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
