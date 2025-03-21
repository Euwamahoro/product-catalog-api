const { v4: uuidv4 } = require('uuid');

// In-memory data store
let categories = [];

class Category {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description || '';
    this.parentId = data.parentId || null; // For category hierarchy
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Get all categories
  static getAll() {
    return categories;
  }

  // Get category by ID
  static getById(id) {
    return categories.find(category => category.id === id);
  }

  // Create a new category
  static create(categoryData) {
    const category = new Category(categoryData);
    categories.push(category);
    return category;
  }

  // Update a category
  static update(id, updateData) {
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) return null;

    const updatedCategory = {
      ...categories[index],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    categories[index] = updatedCategory;
    return updatedCategory;
  }

  // Delete a category
  static delete(id) {
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) return false;

    categories.splice(index, 1);
    return true;
  }

  // Get subcategories
  static getSubcategories(parentId) {
    return categories.filter(category => category.parentId === parentId);
  }

  // Get category hierarchy
  static getHierarchy() {
    // Find all root categories (those without a parent)
    const rootCategories = categories.filter(category => !category.parentId);
    
    // Recursively build the hierarchy
    const buildHierarchy = (parentId) => {
      const children = categories.filter(category => category.parentId === parentId);
      
      if (children.length === 0) {
        return [];
      }
      
      return children.map(child => ({
        ...child,
        children: buildHierarchy(child.id)
      }));
    };
    
    return rootCategories.map(root => ({
      ...root,
      children: buildHierarchy(root.id)
    }));
  }
}

module.exports = Category;