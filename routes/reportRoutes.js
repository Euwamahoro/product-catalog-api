const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Routes for /api/reports
router.get('/low-stock', reportController.getLowStockReport);
router.get('/inventory-summary', reportController.getInventorySummary);
router.get('/category-distribution', reportController.getCategoryDistribution);

module.exports = router;