const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Get low stock items report
exports.getLowStockReport = (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const lowStockItems = Inventory.getLowStockItems();
    
    // Enhance inventory data with product information
    const report = lowStockItems.map(item => {
      const product = Product.getById(item.productId);
      
      if (!product) return null;
      
      let result = {
        inventoryId: item.id,
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        currentStock: item.quantity,
        availableStock: item.availableQuantity,
        threshold: item.lowStockThreshold,
        lastUpdated: item.lastUpdated
      };
      
      // Add variant information if this is a variant inventory
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          result.variantId = item.variantId;
          result.variantName = variant.name;
          result.variantSku = variant.sku;
          result.attributes = variant.attributes;
        }
      }
      
      return result;
    }).filter(item => item !== null); // Remove any null items (if product was deleted)
    
    res.status(200).json({ 
      success: true, 
      count: report.length,
      data: report 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get inventory summary report
exports.getInventorySummary = (req, res) => {
  try {
    const inventoryRecords = Inventory.getLowStockItems();
    
    // Calculate summary statistics
    const summary = {
      totalProducts: Product.getAll().length,
      totalInventoryItems: inventoryRecords.length,
      lowStockItems: inventoryRecords.filter(item => item.isLowStock).length,
      outOfStockItems: inventoryRecords.filter(item => item.quantity === 0).length,
      totalItemsInStock: inventoryRecords.reduce((sum, item) => sum + item.quantity, 0),
      totalReservedItems: inventoryRecords.reduce((sum, item) => sum + item.reservedQuantity, 0),
      totalAvailableItems: inventoryRecords.reduce((sum, item) => sum + item.availableQuantity, 0)
    };
    
    res.status(200).json({ 
      success: true, 
      data: summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get product category distribution report
exports.getCategoryDistribution = (req, res) => {
  try {
    const products = Product.getAll();
    
    // Create a map to count products by category
    const categoryCount = {};
    
    products.forEach(product => {
      if (product.categoryId) {
        categoryCount[product.categoryId] = (categoryCount[product.categoryId] || 0) + 1;
      }
    });
    
    // Convert to array format for response
    const distribution = Object.entries(categoryCount).map(([categoryId, count]) => ({
      categoryId,
      productCount: count,
      percentage: (count / products.length * 100).toFixed(2)
    }));
    
    res.status(200).json({ 
      success: true, 
      count: distribution.length,
      data: distribution 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};