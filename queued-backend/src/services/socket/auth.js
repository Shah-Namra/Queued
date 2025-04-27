/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Socket Authentication Middleware
 */
import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for socket connections
 * @param {Object} socket - Socket instance
 * @param {Function} next - Next function
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuthMiddleware;
