const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateVariant } = require('../middleware/validator');

// Routes for /api/products
router.get('/', productController.getAllProducts);
router.post('/', validateProduct, productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Routes for product variants
router.get('/:id/variants', productController.getProductVariants);
router.post('/:id/variants', validateVariant, productController.addProductVariant);

// Route for products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

module.exports = router;