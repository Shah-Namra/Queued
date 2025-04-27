/**
 * Error Handling Middleware
 * 
 * Centralized error handling for the application
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseError, ValidationError, NotFoundError, AuthenticationError, AuthorizationError, DatabaseError, ExternalServiceError } from '../utils/errors';

/**
* Global error handler middleware
* @param {Error} err - Error object
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.errorHandler = (err, req, res, next) => {
console.error(`[ERROR] ${err.name}: ${err.message}`);

if (err.stack && process.env.NODE_ENV !== 'production') {
console.error(err.stack);
}

// Handle custom errors
if (err instanceof BaseError) {
return res.status(err.statusCode).json({
  success: false,
  error: {
    message: err.message,
    code: err.code || err.name
  }
});
}

// Handle JWT errors
if (err.name === 'JsonWebTokenError') {
return res.status(401).json({
  success: false,
  error: {
    message: 'Invalid token',
    code: 'INVALID_TOKEN'
  }
});
}

if (err.name === 'TokenExpiredError') {
return res.status(401).json({
  success: false,
  error: {
    message: 'Token expired',
    code: 'TOKEN_EXPIRED'
  }
});
}

// Handle database errors
if (err.code && err.code.startsWith('23')) {
return res.status(400).json({
  success: false,
  error: {
    message: 'Database constraint violation',
    code: 'DB_CONSTRAINT_ERROR'
  }
});
}

// Default to 500 server error
return res.status(500).json({
success: false,
error: {
  message: process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message,
  code: 'INTERNAL_SERVER_ERROR'
}
});
};

/**
* Not found handler middleware
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.notFoundHandler = (req, res, next) => {
res.status(404).json({
success: false,
error: {
  message: `Route not found: ${req.method} ${req.originalUrl}`,
  code: 'ROUTE_NOT_FOUND'
}
});
};
