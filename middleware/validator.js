const Joi = require('joi');

// Validate product data
exports.validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required(),
    categoryId: Joi.string().required(),
    price: Joi.number().required().min(0),
    discountPercentage: Joi.number().min(0).max(100).default(0),
    images: Joi.array().items(Joi.string()).default([]),
    variants: Joi.array().items(
      Joi.object({
        id: Joi.string(),
        name: Joi.string().required(),
        attributes: Joi.object().default({}),
        price: Joi.number().min(0),
        sku: Joi.string().required(),
        inventory: Joi.number().min(0)
      })
    ).default([]),
    sku: Joi.string().required(),
    inventory: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error', 
      message: error.details[0].message 
    });
  }
  
  next();
};

// Validate variant data
exports.validateVariant = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    attributes: Joi.object().default({}),
    price: Joi.number().min(0),
    sku: Joi.string().required(),
    inventory: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error', 
      message: error.details[0].message 
    });
  }
  
  next();
};

// Validate category data
exports.validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().default(''),
    parentId: Joi.string().allow(null, '')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error', 
      message: error.details[0].message 
    });
  }
  
  next();
};