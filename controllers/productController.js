const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Get all products
exports.getAllProducts = (req, res) => {
  try {
    const products = Product.getAll();
    res.status(200).json({ 
      success: true,
      count: products.length, 
      data: products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get single product by ID
exports.getProductById = (req, res) => {
  try {
    const product = Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Create new product
exports.createProduct = (req, res) => {
  try {
    const newProduct = Product.create(req.body);
    
    // If product has inventory data, create inventory record
    if (req.body.inventory !== undefined) {
      Inventory.updateInventory({
        productId: newProduct.id,
        quantity: req.body.inventory
      });
    }
    
    // If product has variants with inventory data, create inventory records for each
    if (req.body.variants && req.body.variants.length > 0) {
      req.body.variants.forEach(variant => {
        if (variant.inventory !== undefined) {
          Inventory.updateInventory({
            productId: newProduct.id,
            variantId: variant.id,
            quantity: variant.inventory
          });
        }
      });
    }
    
    res.status(201).json({ 
      success: true, 
      data: newProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Update product
exports.updateProduct = (req, res) => {
  try {
    const updatedProduct = Product.update(req.params.id, req.body);
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    // Update inventory if provided
    if (req.body.inventory !== undefined) {
      Inventory.updateInventory({
        productId: updatedProduct.id,
        quantity: req.body.inventory
      });
    }
    
    // Update variant inventories if provided
    if (req.body.variants) {
      req.body.variants.forEach(variant => {
        if (variant.inventory !== undefined) {
          Inventory.updateInventory({
            productId: updatedProduct.id,
            variantId: variant.id,
            quantity: variant.inventory
          });
        }
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Delete product
exports.deleteProduct = (req, res) => {
  try {
    const deleted = Product.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get product variants
exports.getProductVariants = (req, res) => {
  try {
    const product = Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      count: product.variants.length,
      data: product.variants 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Add variant to product
exports.addProductVariant = (req, res) => {
  try {
    const product = Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    const variant = {
      id: req.body.id || uuidv4(),
      name: req.body.name,
      attributes: req.body.attributes || {},
      price: req.body.price || product.price,
      sku: req.body.sku
    };
    
    product.variants.push(variant);
    const updatedProduct = Product.update(req.params.id, product);
    
    // Create inventory record for variant if inventory data provided
    if (req.body.inventory !== undefined) {
      Inventory.updateInventory({
        productId: product.id,
        variantId: variant.id,
        quantity: req.body.inventory
      });
    }
    
    res.status(201).json({ 
      success: true, 
      data: variant 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = Product.findByCategory(categoryId);
    
    res.status(200).json({ 
      success: true, 
      count: products.length,
      data: products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};