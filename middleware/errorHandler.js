const logger = require('../utils/logger');

// Central error handling middleware
exports.errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, { 
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack
  });
  
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};