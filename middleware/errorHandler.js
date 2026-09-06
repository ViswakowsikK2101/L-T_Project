const ApiError = require('../utils/ApiError');

/**
 * Centralized Express error-handling middleware.
 * Must be registered LAST (after all routes).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // ---- Operational ApiError ----
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  // ---- Mongoose validation error ----
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('; '),
      errorCode: 'VALIDATION_ERROR',
    });
  }

  // ---- Mongoose CastError (invalid ObjectId, etc.) ----
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      errorCode: 'INVALID_ID',
    });
  }

  // ---- MongoDB duplicate-key error ----
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field(s): ${field}`,
      errorCode: 'DUPLICATE_KEY',
    });
  }

  // ---- JWT errors (fallback for any missed in auth middleware) ----
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
      errorCode: 'UNAUTHORIZED',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token has expired.',
      errorCode: 'UNAUTHORIZED',
    });
  }

  // ---- Unknown / unexpected errors ----
  console.error('UNHANDLED ERROR:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    errorCode: 'INTERNAL_ERROR',
  });
};

module.exports = errorHandler;
