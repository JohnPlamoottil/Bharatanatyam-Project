const { HTTP_STATUS } = require("../utils/constants");

/**
 * Base API Error class
 * All custom errors should extend this class
 */
class ApiError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 * Used for invalid request data or parameters
 */
class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * 401 Unauthorized Error
 * Used for authentication failures
 */
class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * 403 Forbidden Error
 * Used when user doesn't have permission to access resource
 */
class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

/**
 * 404 Not Found Error
 * Used when requested resource doesn't exist
 */
class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * 409 Conflict Error
 * Used when request conflicts with current state (e.g., duplicate entries)
 */
class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

/**
 * 422 Unprocessable Entity Error
 * Used for validation errors
 */
class ValidationError extends ApiError {
  constructor(message = "Validation failed", errors = null) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}

/**
 * 429 Too Many Requests Error
 * Used when rate limit is exceeded
 */
class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests") {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}

/**
 * Database Error
 * Used for database operation failures
 */
class DatabaseError extends ApiError {
  constructor(message = "Database operation failed") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
  DatabaseError,
};
