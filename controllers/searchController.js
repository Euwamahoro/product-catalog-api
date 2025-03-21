const Product = require('../models/Product');

// Search products by term
exports.searchProducts = (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const products = Product.search(query);
    
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

// Filter products by various criteria
exports.filterProducts = (req, res) => {
  try {
    let filteredProducts = Product.getAll();
    
    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categoryId === req.query.category
      );
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Infinity;
      
      filteredProducts = filteredProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }
    
    // Filter by discount
    if (req.query.discount === 'true') {
      filteredProducts = filteredProducts.filter(product => 
        product.discountPercentage > 0
      );
    }
    
    // Filter by attributes (for variants)
    if (req.query.attributes) {
      try {
        const attributes = JSON.parse(req.query.attributes);
        
        filteredProducts = filteredProducts.filter(product => {
          // Check if any variant matches all the requested attributes
          if (!product.variants || product.variants.length === 0) {
            return false;
          }
          
          return product.variants.some(variant => {
            if (!variant.attributes) return false;
            
            // Check if all requested attributes match
            return Object.entries(attributes).every(([key, value]) => 
              variant.attributes[key] === value
            );
          });
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid attributes format',
          message: 'Attributes should be a valid JSON object'
        });
      }
    }
    
    // Sort results
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') 
        ? req.query.sort.substring(1) 
        : req.query.sort;
      
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      
      filteredProducts.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      page,
      pages: Math.ceil(filteredProducts.length / limit),
      data: paginatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};