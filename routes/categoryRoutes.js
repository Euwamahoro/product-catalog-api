const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validator');

// Routes for /api/categories
router.get('/', categoryController.getAllCategories);
router.post('/', validateCategory, categoryController.createCategory);
router.get('/hierarchy', categoryController.getCategoryHierarchy);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/:id/subcategories', categoryController.getSubcategories);

module.exports = router;