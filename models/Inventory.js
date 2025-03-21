const { v4: uuidv4 } = require('uuid');

// In-memory data store
let inventoryRecords = [];

class Inventory {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.productId = data.productId;
    this.variantId = data.variantId || null; // If this is a variant inventory
    this.quantity = data.quantity || 0;
    this.reservedQuantity = data.reservedQuantity || 0; // For items in shopping carts
    this.lowStockThreshold = data.lowStockThreshold || 5;
    this.lastUpdated = new Date().toISOString();
  }

  // Get available quantity
  get availableQuantity() {
    return this.quantity - this.reservedQuantity;
  }

  // Check if item is in stock
  get inStock() {
    return this.availableQuantity > 0;
  }

  // Check if stock is low
  get isLowStock() {
    return this.availableQuantity < this.lowStockThreshold;
  }

  // Get inventory for a product
  static getByProductId(productId) {
    return inventoryRecords.find(record => 
      record.productId === productId && !record.variantId
    );
  }

  // Get inventory for a variant
  static getByVariantId(productId, variantId) {
    return inventoryRecords.find(record => 
      record.productId === productId && record.variantId === variantId
    );
  }

  // Create or update inventory
  static updateInventory(data) {
    let record;
    
    if (data.variantId) {
      // Variant inventory
      record = this.getByVariantId(data.productId, data.variantId);
    } else {
      // Product inventory
      record = this.getByProductId(data.productId);
    }

    if (record) {
      // Update existing record
      record.quantity = data.quantity;
      record.reservedQuantity = data.reservedQuantity || record.reservedQuantity;
      record.lowStockThreshold = data.lowStockThreshold || record.lowStockThreshold;
      record.lastUpdated = new Date().toISOString();
      return record;
    } else {
      // Create new record
      const newRecord = new Inventory(data);
      inventoryRecords.push(newRecord);
      return newRecord;
    }
  }

  // Get all low stock items
  static getLowStockItems() {
    return inventoryRecords.filter(record => record.isLowStock);
  }

  // Reserve inventory (e.g., when added to cart)
  static reserveInventory(productId, variantId, quantity) {
    const record = variantId 
      ? this.getByVariantId(productId, variantId)
      : this.getByProductId(productId);

    if (!record || record.availableQuantity < quantity) {
      return false; // Not enough inventory
    }

    record.reservedQuantity += quantity;
    record.lastUpdated = new Date().toISOString();
    return true;
  }

  // Release reserved inventory (e.g., when removed from cart)
  static releaseReserved(productId, variantId, quantity) {
    const record = variantId 
      ? this.getByVariantId(productId, variantId)
      : this.getByProductId(productId);

    if (!record) return false;

    const amountToRelease = Math.min(record.reservedQuantity, quantity);
    record.reservedQuantity -= amountToRelease;
    record.lastUpdated = new Date().toISOString();
    return true;
  }

  // Commit inventory change (e.g., when order is placed)
  static commitInventoryChange(productId, variantId, quantity) {
    const record = variantId 
      ? this.getByVariantId(productId, variantId)
      : this.getByProductId(productId);

    if (!record) return false;

    // First release the reservation
    this.releaseReserved(productId, variantId, quantity);
    
    // Then reduce the actual quantity
    record.quantity -= quantity;
    record.lastUpdated = new Date().toISOString();
    return true;
  }
}

module.exports = Inventory;