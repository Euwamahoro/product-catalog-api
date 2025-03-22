# Product Catalog API

A RESTful API for managing a product catalog system for e-commerce platforms. This API handles product management, categories, inventory tracking, and search functionality.

## Table of Contents

- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Limitations and Future Improvements](#limitations-and-future-improvements)

## Features

- ✅ Complete CRUD operations for products and categories
- ✅ Support for product variants (size, color, etc.)
- ✅ Category hierarchy with parent-child relationships
- ✅ Inventory tracking for products and variants
- ✅ Search and filter functionality
- ✅ Reporting for low stock items
- ✅ Input validation and error handling
- ✅ Comprehensive API documentation

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation Steps

1. Clone the repository:
```
git clone https://github.com/yourusername/product-catalog-api.git
cd product-catalog-api
```

2. Install dependencies:
```
npm install
```

3. Create a .env file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

4. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## API Documentation

### Base URL

When running locally, the base URL is: `http://localhost:3000/api`

### Authentication

This implementation does not include authentication. In a production environment, you would want to implement authentication and authorization mechanisms.

### Response Format

All endpoints return responses in the following format:

```json
{
  "success": true|false,
  "count": 10
  "data": {data}
}
```

For errors:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Error message"
}
```

### API Endpoints

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get a single product by ID |
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| GET | `/products/:id/variants` | Get all variants for a product |
| POST | `/products/:id/variants` | Add a new variant to a product |
| GET | `/products/category/:categoryId` | Get products by category |

#### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/:id` | Get a single category by ID |
| POST | `/categories` | Create a new category |
| PUT | `/categories/:id` | Update a category |
| DELETE | `/categories/:id` | Delete a category |
| GET | `/categories/hierarchy` | Get the full category hierarchy |
| GET | `/categories/:id/subcategories` | Get subcategories for a category |

#### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=term` | Search products by term |
| GET | `/search/filter` | Filter products with multiple criteria |

Filter parameters:
- `category`: Filter by category ID
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `discount`: Set to "true" to show only discounted products
- `attributes`: JSON object with attribute key-value pairs
- `sort`: Sort field (prefix with `-` for descending order)
- `page`: Page number for pagination
- `limit`: Number of results per page

#### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/low-stock` | Get low stock items |
| GET | `/reports/inventory-summary` | Get inventory summary |
| GET | `/reports/category-distribution` | Get product distribution by category |

### Request and Response Examples

#### Create a Product

Request:
```
POST /api/products
Content-Type: application/json

{
  "name": "Classic T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "categoryId": "clothing-123",
  "price": 19.99,
  "discountPercentage": 10,
  "images": ["tshirt-front.jpg", "tshirt-back.jpg"],
  "variants": [
    {
      "name": "Small / Blue",
      "attributes": {
        "size": "S",
        "color": "Blue"
      },
      "sku": "TS-S-BLU",
      "inventory": 25
    },
    {
      "name": "Medium / Blue",
      "attributes": {
        "size": "M",
        "color": "Blue"
      },
      "sku": "TS-M-BLU",
      "inventory": 30
    }
  ],
  "sku": "TSHIRT-CLASSIC",
  "inventory": 100
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "7f4c2b3a-1c9d-4e8f-5a6b-7c8d9e0f1a2b",
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "categoryId": "clothing-123",
    "price": 19.99,
    "discountPercentage": 10,
    "images": ["tshirt-front.jpg", "tshirt-back.jpg"],
    "variants": [
      {
        "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        "name": "Small / Blue",
        "attributes": {
          "size": "S",
          "color": "Blue"
        },
        "sku": "TS-S-BLU"
      },
      {
        "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
        "name": "Medium / Blue",
        "attributes": {
          "size": "M",
          "color": "Blue"
        },
        "sku": "TS-M-BLU"
      }
    ],
    "sku": "TSHIRT-CLASSIC",
    "createdAt": "2023-10-15T12:00:00.000Z",
    "updatedAt": "2023-10-15T12:00:00.000Z"
  }
}
```

#### Search Products

Request:
```
GET /api/search?q=shirt
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "7f4c2b3a-1c9d-4e8f-5a6b-7c8d9e0f1a2b",
      "name": "Classic T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "price": 19.99,
      "discountPercentage": 10,
      "sku": "TSHIRT-CLASSIC"
    },
    {
      "id": "8e5d3c2b-1a9f-8e7d-6c5b-4d3e2f1a0b9c",
      "name": "Button-up Shirt",
      "description": "Formal button-up shirt",
      "price": 39.99,
      "discountPercentage": 0,
      "sku": "SHIRT-FORMAL"
    }
  ]
}
```

## Testing

You can test the API using tools like Postman, cURL, or the VS Code REST Client extension.

To run automated tests:
```
npm test
```

## Design Decisions

1. **In-Memory Data Storage**: For simplicity, this implementation uses in-memory data storage. In a production environment, you would want to use a database like MongoDB, PostgreSQL, or MySQL.

2. **Modular Structure**: The API is structured in a modular way with separate controllers, models, and routes to make it maintainable and scalable.

3. **Error Handling**: A centralized error handling middleware is used to ensure consistent error responses across the API.

4. **Validation**: Input validation is implemented using Joi to ensure data integrity.

5. **RESTful Design**: The API follows REST principles with appropriate HTTP methods and status codes.

## Limitations and Future Improvements

1. **Persistence**: The current implementation uses in-memory storage which doesn't persist between server restarts. Adding a database is a key improvement.

2. **Authentication and Authorization**: Implementation of user authentication and role-based access control would be necessary for a production environment.

3. **Testing**: More comprehensive unit and integration tests should be added.

4. **Pagination**: While the search endpoint implements pagination, other collection endpoints could benefit from it as well.

5. **Documentation**: A more interactive API documentation using tools like Swagger/OpenAPI would enhance developer experience.

6. **Logging**: While basic logging is implemented, a more robust logging system with rotation and monitoring would be beneficial.

7. **Image Handling**: Adding support for uploading and serving product images.

8. **Caching**: Implementing caching mechanisms to improve performance for frequently accessed data.

9. **Webhooks**: Adding webhook support for notifying other systems of catalog changes.