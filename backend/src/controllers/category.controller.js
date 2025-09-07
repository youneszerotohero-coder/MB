const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const { validateCategoryData } = require('../utils/validators');
const prisma = new PrismaClient();

class CategoryController {
  // Get all categories with hierarchy
  async getCategories(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        parentId,
        isActive,
        includeProducts = false,
        sortBy = 'sortOrder',
        sortOrder = 'asc'
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const where = {};

      // Apply filters
      if (parentId !== undefined) {
        where.parentId = parentId === 'null' ? null : parentId;
      }
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const include = {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
        parent: true
      };

      // Include products if requested
      if (includeProducts === 'true') {
        include.products = {
          where: { isActive: true },
          take: 10,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        };
      }

      const [categories, totalCount] = await Promise.all([
        prisma.category.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include
        }),
        prisma.category.count({ where })
      ]);

      return successResponse(res, 'Categories retrieved successfully', {
        categories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      return errorResponse(res, 'Failed to retrieve categories', 500);
    }
  }

  // Get category tree (hierarchical structure)
  async getCategoryTree(req, res) {
    try {
      const { isActive = true } = req.query;
      const where = { parentId: null };
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const categories = await prisma.category.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        include: {
          children: {
            where: { isActive: isActive === 'true' },
            orderBy: { sortOrder: 'asc' },
            include: {
              children: {
                where: { isActive: isActive === 'true' },
                orderBy: { sortOrder: 'asc' }
              }
            }
          }
        }
      });

      return successResponse(res, 'Category tree retrieved successfully', categories);
    } catch (error) {
      console.error('Error getting category tree:', error);
      return errorResponse(res, 'Failed to retrieve category tree', 500);
    }
  }

  // Get single category by ID or slug
  async getCategory(req, res) {
    try {
      const { id } = req.params;
      const { includeProducts = false } = req.query;
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      const include = {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      };

      if (includeProducts === 'true') {
        include.products = {
          where: { isActive: true },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          },
          orderBy: { createdAt: 'desc' }
        };
      }

      const category = await prisma.category.findUnique({
        where: isUuid ? { id } : { slug: id },
        include
      });

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      return successResponse(res, 'Category retrieved successfully', category);
    } catch (error) {
      console.error('Error getting category:', error);
      return errorResponse(res, 'Failed to retrieve category', 500);
    }
  }

  // Create new category
  async createCategory(req, res) {
    try {
      // Validate category data
      const validation = validateCategoryData(req.body);
      if (!validation.isValid) {
        return errorResponse(res, 'Validation error', 400, validation.errors);
      }

      const { name, slug, parentId, sortOrder = 0, isActive = true } = req.body;

      // Check if parent exists (if parentId is provided)
      if (parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: parentId }
        });
        if (!parentCategory) {
          return errorResponse(res, 'Parent category not found', 404);
        }
      }

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          parentId,
          sortOrder: parseInt(sortOrder),
          isActive
        },
        include: {
          parent: true,
          children: true
        }
      });

      return successResponse(res, 'Category created successfully', category, 201);
    } catch (error) {
      console.error('Error creating category:', error);
      
      if (error.code === 'P2002') {
        return errorResponse(res, 'Category with this slug already exists', 409);
      }

      return errorResponse(res, 'Failed to create category', 500);
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const { id } = req.params;

      // Validate category data for update
      const validation = validateCategoryData(req.body, false);
      if (!validation.isValid) {
        return errorResponse(res, 'Validation error', 400, validation.errors);
      }

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id }
      });

      if (!existingCategory) {
        return errorResponse(res, 'Category not found', 404);
      }

      // Check if trying to set itself as parent (prevent circular reference)
      if (req.body.parentId === id) {
        return errorResponse(res, 'Category cannot be its own parent', 400);
      }

      // Check if parent exists (if parentId is provided)
      if (req.body.parentId && req.body.parentId !== existingCategory.parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: req.body.parentId }
        });
        if (!parentCategory) {
          return errorResponse(res, 'Parent category not found', 404);
        }

        // Prevent setting a child as parent (circular reference)
        const isChild = await this.isChildCategory(id, req.body.parentId);
        if (isChild) {
          return errorResponse(res, 'Cannot set a child category as parent', 400);
        }
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          ...req.body,
          sortOrder: req.body.sortOrder ? parseInt(req.body.sortOrder) : undefined
        },
        include: {
          parent: true,
          children: true
        }
      });

      return successResponse(res, 'Category updated successfully', updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      
      if (error.code === 'P2002') {
        return errorResponse(res, 'Category with this slug already exists', 409);
      }

      return errorResponse(res, 'Failed to update category', 500);
    }
  }

  // Delete category
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const { moveProducts = null } = req.query;

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
          children: true
        }
      });

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      // Check if category has children
      if (category.children.length > 0) {
        return errorResponse(res, 'Cannot delete category with subcategories', 400);
      }

      await prisma.$transaction(async (tx) => {
        // Handle products in the category
        if (category.products.length > 0) {
          if (moveProducts) {
            // Move products to another category
            const targetCategory = await tx.category.findUnique({
              where: { id: moveProducts }
            });
            if (!targetCategory) {
              throw new Error('Target category not found');
            }

            await tx.product.updateMany({
              where: { categoryId: id },
              data: { categoryId: moveProducts }
            });

            // Update target category product count
            await this.updateCategoryProductCount(moveProducts, tx);
          } else {
            // Set products category to null
            await tx.product.updateMany({
              where: { categoryId: id },
              data: { categoryId: null }
            });
          }
        }

        // Delete the category
        await tx.category.delete({
          where: { id }
        });
      });

      return successResponse(res, 'Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      return errorResponse(res, error.message || 'Failed to delete category', 500);
    }
  }

  // Get category breadcrumbs
  async getCategoryBreadcrumbs(req, res) {
    try {
      const { id } = req.params;
      
      const breadcrumbs = await this.buildBreadcrumbs(id);
      
      return successResponse(res, 'Category breadcrumbs retrieved successfully', breadcrumbs);
    } catch (error) {
      console.error('Error getting category breadcrumbs:', error);
      return errorResponse(res, 'Failed to retrieve category breadcrumbs', 500);
    }
  }

  // Reorder categories
  async reorderCategories(req, res) {
    try {
      const { categoryOrders } = req.body;

      if (!Array.isArray(categoryOrders)) {
        return errorResponse(res, 'Category orders must be an array', 400);
      }

      await prisma.$transaction(async (tx) => {
        for (const { id, sortOrder } of categoryOrders) {
          await tx.category.update({
            where: { id },
            data: { sortOrder: parseInt(sortOrder) }
          });
        }
      });

      return successResponse(res, 'Categories reordered successfully');
    } catch (error) {
      console.error('Error reordering categories:', error);
      return errorResponse(res, 'Failed to reorder categories', 500);
    }
  }

  // Toggle category active status
  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      
      const category = await prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { isActive: !category.isActive },
        include: {
          parent: true,
          children: true
        }
      });

      return successResponse(res, 'Category status updated successfully', updatedCategory);
    } catch (error) {
      console.error('Error toggling category status:', error);
      return errorResponse(res, 'Failed to update category status', 500);
    }
  }

  // Get categories with product count
  async getCategoriesWithProductCount(req, res) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true }
          },
          children: {
            where: { isActive: true },
            include: {
              _count: {
                select: { products: true }
              }
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      return successResponse(res, 'Categories with product count retrieved successfully', categories);
    } catch (error) {
      console.error('Error getting categories with product count:', error);
      return errorResponse(res, 'Failed to retrieve categories with product count', 500);
    }
  }

  // Helper methods
  async isChildCategory(parentId, childId) {
    const child = await prisma.category.findUnique({
      where: { id: childId },
      include: { parent: true }
    });

    if (!child || !child.parent) return false;
    if (child.parent.id === parentId) return true;
    
    return await this.isChildCategory(parentId, child.parent.id);
  }

  async buildBreadcrumbs(categoryId) {
    const breadcrumbs = [];
    let currentId = categoryId;

    while (currentId) {
      const category = await prisma.category.findUnique({
        where: { id: currentId },
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true
        }
      });

      if (!category) break;

      breadcrumbs.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug
      });

      currentId = category.parentId;
    }

    return breadcrumbs;
  }

  async updateCategoryProductCount(categoryId, tx = prisma) {
    const productCount = await tx.product.count({
      where: { categoryId, isActive: true }
    });

    const products = await tx.product.findMany({
      where: { categoryId, isActive: true },
      select: { price: true }
    });

    const prices = products.map(p => parseFloat(p.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    await tx.category.update({
      where: { id: categoryId },
      data: {
        productCount,
        minPrice,
        maxPrice
      }
    });
  }
}

module.exports = new CategoryController();