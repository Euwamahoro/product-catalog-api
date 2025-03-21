const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate Limit Exceeded',
    message: 'Too many requests, please try again later'
  }
});

module.exports = limiter;