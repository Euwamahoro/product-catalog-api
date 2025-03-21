const { v4: uuidv4 } = require('uuid');

// In-memory data store
let products = [];

class Product {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description;
    this.categoryId = data.categoryId;
    this.price = data.price;
    this.discountPercentage = data.discountPercentage || 0;
    this.images = data.images || [];
    this.variants = data.variants || [];
    this.sku = data.sku;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Calculate discounted price
  get finalPrice() {
    return this.price * (1 - this.discountPercentage / 100);
  }

  // Get all products
  static getAll() {
    return products;
  }

  // Get product by ID
  static getById(id) {
    return products.find(product => product.id === id);
  }

  // Create a new product
  static create(productData) {
    const product = new Product(productData);
    products.push(product);
    return product;
  }

  // Update a product
  static update(id, updateData) {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    return updatedProduct;
  }

  // Delete a product
  static delete(id) {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  }

  // Search products
  static search(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
    );
  }

  // Filter products by category
  static findByCategory(categoryId) {
    return products.filter(product => product.categoryId === categoryId);
  }

  // Filter products by price range
  static findByPriceRange(min, max) {
    return products.filter(product => 
      product.price >= min && product.price <= max
    );
  }

  // Get products with low inventory
  static getLowInventory(threshold) {
    return products.filter(product => {
      // For simple products without variants
      if (product.inventory && product.inventory < threshold) {
        return true;
      }
      
      // For products with variants
      if (product.variants && product.variants.length > 0) {
        return product.variants.some(variant => variant.inventory < threshold);
      }
      
      return false;
    });
  }
}

module.exports = Product;