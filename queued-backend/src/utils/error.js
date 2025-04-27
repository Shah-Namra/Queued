
/**
 * Custom Error Classes
 * 
 * Defines application-specific error types for consistent error handling
 */

/**
 * Base error class for all application errors
 */
class BaseError extends Error {
    constructor(message, statusCode, code) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.code = code;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Validation error (400)
   * Used when request data fails validation
   */
  class ValidationError extends BaseError {
    constructor(message, code = 'VALIDATION_ERROR') {
      super(message, 400, code);
    }
  }
  
  /**
   * Bad request error (400)
   * Used for generic client errors
   */
  class BadRequestError extends BaseError {
    constructor(message, code = 'BAD_REQUEST') {
      super(message, 400, code);
    }
  }
  
  /**
   * Authentication error (401)
   * Used when authentication fails
   */
  class AuthenticationError extends BaseError {
    constructor(message, code = 'AUTHENTICATION_ERROR') {
      super(message, 401, code);
    }
  }
  
  /**
   * Authorization error (403)
   * Used when a user lacks permissions
   */
  class AuthorizationError extends BaseError {
    constructor(message, code = 'AUTHORIZATION_ERROR') {
      super(message, 403, code);
    }
  }
  
  /**
   * Not found error (404)
   * Used when a requested resource is not found
   */
  class NotFoundError extends BaseError {
    constructor(message, code = 'NOT_FOUND') {
      super(message, 404, code);
    }
  }
  
  /**
   * Database error (500)
   * Used for database-related errors
   */
  class DatabaseError extends BaseError {
    constructor(message, code = 'DATABASE_ERROR') {
      super(message, 500, code);
    }
  }
  
  /**
   * External service error (502)
   * Used when an external service (e.g., Spotify) fails
   */
  class ExternalServiceError extends BaseError {
    constructor(message, code = 'EXTERNAL_SERVICE_ERROR') {
      super(message, 502, code);
    }
  }
  
  module.exports = {
    BaseError,
    ValidationError,
    BadRequestError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    DatabaseError,
    ExternalServiceError
  };
  