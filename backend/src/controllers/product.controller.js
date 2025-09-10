const productService = require('../services/product.service');
const { successResponse, errorResponse } = require('../utils/response');
const { validateProductData } = require('../utils/validators');

class ProductController {
  constructor() {
    // Bind all methods to the instance
    this.getProducts = this.getProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.searchProducts = this.searchProducts.bind(this);
    this.getFeaturedProducts = this.getFeaturedProducts.bind(this);
    this.getProductsByCategory = this.getProductsByCategory.bind(this);
    this.updateStock = this.updateStock.bind(this);
    this.toggleFeatured = this.toggleFeatured.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.getProductVariants = this.getProductVariants.bind(this);
    this.bulkUpdateProducts = this.bulkUpdateProducts.bind(this);
    this.getLowStockProducts = this.getLowStockProducts.bind(this);
  }
  // Get all products with filters
  async getProducts(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        categoryId: req.query.categoryId,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        isFeatured: req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' : undefined,
        brand: req.query.brand,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await productService.getProducts(filters);
      return successResponse(res, 'Products retrieved successfully', result);
    } catch (error) {
      console.error('Error getting products:', error);
      return errorResponse(res, 'Failed to retrieve products', 500);
    }
  }

  // Get single product by ID or slug
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProduct(id);

      if (!product) {
        return errorResponse(res, 'Product not found', 404);
      }

      return successResponse(res, 'Product retrieved successfully', product);
    } catch (error) {
      console.error('Error getting product:', error);
      return errorResponse(res, 'Failed to retrieve product', 500);
    }
  }

  // Create new product
  async createProduct(req, res) {
    try {
      // Validate product data
      const validation = validateProductData(req.body);
      if (!validation.isValid) {
        return errorResponse(res, 'Validation error', 400, validation.errors);
      }

      const product = await productService.createProduct(req.body);
      return successResponse(res, 'Product created successfully', product, 201);
    } catch (error) {
      console.error('Error creating product:', error);
      
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        return errorResponse(res, `Product with this ${field} already exists`, 409);
      }

      return errorResponse(res, 'Failed to create product,error:' + error.message, 500);
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;

      // Validate product data for update
      const validation = validateProductData(req.body, false);
      if (!validation.isValid) {
        return errorResponse(res, 'Validation error', 400, validation.errors);
      }

      const product = await productService.updateProduct(id, req.body);
      return successResponse(res, 'Product updated successfully', product);
    } catch (error) {
      console.error('Error updating product:', error);
      
      if (error.message === 'Product not found') {
        return errorResponse(res, 'Product not found', 404);
      }

      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'field';
        return errorResponse(res, `Product with this ${field} already exists`, 409);
      }

      return errorResponse(res, 'Failed to update product', 500);
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      return successResponse(res, result.message);
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (error.message === 'Product not found') {
        return errorResponse(res, 'Product not found', 404);
      }

      return errorResponse(res, 'Failed to delete product', 500);
    }
  }

  // Update product stock
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { variantId, quantity, operation = 'set' } = req.body;

      if (!quantity && quantity !== 0) {
        return errorResponse(res, 'Quantity is required', 400);
      }

      if (quantity < 0) {
        return errorResponse(res, 'Quantity cannot be negative', 400);
      }

      const result = await productService.updateStock(id, variantId, parseInt(quantity), operation);
      return successResponse(res, 'Stock updated successfully', result);
    } catch (error) {
      console.error('Error updating stock:', error);
      return errorResponse(res, 'Failed to update stock', 500);
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await productService.getProductsByCategory(categoryId, options);
      return successResponse(res, 'Products retrieved successfully', result);
    } catch (error) {
      console.error('Error getting products by category:', error);
      return errorResponse(res, 'Failed to retrieve products', 500);
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.trim().length < 2) {
        return errorResponse(res, 'Search query must be at least 2 characters long', 400);
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await productService.searchProducts(query.trim(), options);
      return successResponse(res, 'Search completed successfully', result);
    } catch (error) {
      console.error('Error searching products:', error);
      return errorResponse(res, 'Failed to search products', 500);
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await productService.getFeaturedProducts(limit);
      return successResponse(res, 'Featured products retrieved successfully', products);
    } catch (error) {
      console.error('Error getting featured products:', error);
      return errorResponse(res, 'Failed to retrieve featured products', 500);
    }
  }

  // Toggle product featured status
  async toggleFeatured(req, res) {
    try {
      const { id } = req.params;
      
      // Get current product to toggle featured status
      const currentProduct = await productService.getProduct(id);
      if (!currentProduct) {
        return errorResponse(res, 'Product not found', 404);
      }

      const updatedProduct = await productService.updateProduct(id, {
        isFeatured: !currentProduct.isFeatured
      });

      return successResponse(res, 'Product featured status updated successfully', updatedProduct);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return errorResponse(res, 'Failed to update featured status', 500);
    }
  }

  // Toggle product active status
  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      
      // Get current product to toggle active status
      const currentProduct = await productService.getProduct(id);
      if (!currentProduct) {
        return errorResponse(res, 'Product not found', 404);
      }

      const updatedProduct = await productService.updateProduct(id, {
        isActive: !currentProduct.isActive
      });

      return successResponse(res, 'Product status updated successfully', updatedProduct);
    } catch (error) {
      console.error('Error toggling active status:', error);
      return errorResponse(res, 'Failed to update product status', 500);
    }
  }

  // Get product variants
  async getProductVariants(req, res) {
    try {
      const { id } = req.params;
      
      const product = await productService.getProduct(id);
      if (!product) {
        return errorResponse(res, 'Product not found', 404);
      }

      return successResponse(res, 'Product variants retrieved successfully', {
        variants: product.variants,
        colors: product.colors,
        sizes: product.sizes
      });
    } catch (error) {
      console.error('Error getting product variants:', error);
      return errorResponse(res, 'Failed to retrieve product variants', 500);
    }
  }

  // Bulk update products
  async bulkUpdateProducts(req, res) {
    try {
      const { productIds, updateData } = req.body;

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return errorResponse(res, 'Product IDs array is required', 400);
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return errorResponse(res, 'Update data is required', 400);
      }

      const results = [];
      for (const productId of productIds) {
        try {
          const updatedProduct = await productService.updateProduct(productId, updateData);
          results.push({ id: productId, success: true, product: updatedProduct });
        } catch (error) {
          results.push({ id: productId, success: false, error: error.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      return successResponse(res, 'Bulk update completed', {
        totalProcessed: productIds.length,
        successful: successCount,
        failed: failureCount,
        results
      });
    } catch (error) {
      console.error('Error in bulk update:', error);
      return errorResponse(res, 'Failed to perform bulk update', 500);
    }
  }

  // Get low stock products
  async getLowStockProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      
      const products = await productService.getProducts({
        isActive: true,
        limit,
        sortBy: 'stockQuantity',
        sortOrder: 'asc'
      });

      // Filter products with low stock
      const lowStockProducts = products.products.filter(product => {
        if (product.hasVariants) {
          return product.variants.some(variant => 
            variant.stockQuantity <= (product.lowStockAlert || 10)
          );
        } else {
          return product.stockQuantity <= (product.lowStockAlert || 10);
        }
      });

      return successResponse(res, 'Low stock products retrieved successfully', {
        products: lowStockProducts,
        count: lowStockProducts.length
      });
    } catch (error) {
      console.error('Error getting low stock products:', error);
      return errorResponse(res, 'Failed to retrieve low stock products', 500);
    }
  }
}

module.exports = new ProductController();