require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  // Storage configuration - using in-memory storage for this implementation
  // In a real application, this would be database connection details
  dataStore: {
    type: 'memory', // Options: 'memory', 'file', 'database'
    // For database connections, add relevant config parameters here
  },
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};