const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

const PORT = config.port || 3000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});