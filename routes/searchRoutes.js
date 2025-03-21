const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Routes for /api/search
router.get('/', searchController.searchProducts);
router.get('/filter', searchController.filterProducts);

module.exports = router;