const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getAllCategories = (req, res) => {
  try {
    const categories = Category.getAll();
    res.status(200).json({ 
      success: true,
      count: categories.length, 
      data: categories 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get single category by ID
exports.getCategoryById = (req, res) => {
  try {
    const category = Category.getById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Create new category
exports.createCategory = (req, res) => {
  try {
    // Check if parent category exists when parentId is provided
    if (req.body.parentId) {
      const parentCategory = Category.getById(req.body.parentId);
      if (!parentCategory) {
        return res.status(400).json({ 
          success: false, 
          error: 'Parent category not found' 
        });
      }
    }
    
    const newCategory = Category.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: newCategory 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Update category
exports.updateCategory = (req, res) => {
  try {
    // Check for circular reference in category hierarchy
    if (req.body.parentId) {
      // Cannot set parent to self
      if (req.body.parentId === req.params.id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Category cannot be its own parent' 
        });
      }
      
      // Check if parent category exists
      const parentCategory = Category.getById(req.body.parentId);
      if (!parentCategory) {
        return res.status(400).json({ 
          success: false, 
          error: 'Parent category not found' 
        });
      }
      
      // TODO: Check for deeper circular references in hierarchy
    }
    
    const updatedCategory = Category.update(req.params.id, req.body);
    
    if (!updatedCategory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: updatedCategory 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Delete category
exports.deleteCategory = (req, res) => {
  try {
    // Check if category has children
    const subcategories = Category.getSubcategories(req.params.id);
    if (subcategories.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete category with subcategories',
        message: 'Delete or reassign subcategories first'
      });
    }
    
    // Check if category has products
    const products = Product.findByCategory(req.params.id);
    if (products.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete category with associated products',
        message: 'Delete or reassign products first'
      });
    }
    
    const deleted = Category.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
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

// Get category hierarchy
exports.getCategoryHierarchy = (req, res) => {
  try {
    const hierarchy = Category.getHierarchy();
    res.status(200).json({ 
      success: true, 
      data: hierarchy 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};

// Get subcategories
exports.getSubcategories = (req, res) => {
  try {
    const subcategories = Category.getSubcategories(req.params.id);
    res.status(200).json({ 
      success: true, 
      count: subcategories.length,
      data: subcategories 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: error.message 
    });
  }
};