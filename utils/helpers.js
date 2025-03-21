/**
 * Helper functions for the product catalog API
 */

// Pagination helper
exports.paginate = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
      data: items.slice(startIndex, endIndex),
      pagination: {
        total: items.length,
        page,
        limit,
        pages: Math.ceil(items.length / limit)
      }
    };
    
    if (endIndex < items.length) {
      results.pagination.next = page + 1;
    }
    
    if (startIndex > 0) {
      results.pagination.prev = page - 1;
    }
    
    return results;
  };
  
  // Format price helper
  exports.formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };
  
  // Calculate discount price
  exports.calculateDiscountedPrice = (price, discountPercentage) => {
    return price * (1 - discountPercentage / 100);
  };
  
  // Check if object is empty
  exports.isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  // Deep clone an object
  exports.deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Generate a slug from a string
  exports.slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  };