const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductService {
  // Get all products with filters and pagination
  async getProducts(filters = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      isActive,
      isFeatured,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    // Colors filter (expects array or comma-separated string)
    if (filters.colors) {
      const colors = Array.isArray(filters.colors) ? filters.colors : String(filters.colors).split(',');
      where.colors = { some: { name: { in: colors } } };
    }

    // Sizes filter (expects array or comma-separated string)
    if (filters.sizes) {
      const sizes = Array.isArray(filters.sizes) ? filters.sizes : String(filters.sizes).split(',');
      where.sizes = { some: { value: { in: sizes } } };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          variants: {
            include: {
              color: true,
              size: true
            }
          },
          colors: true,
          sizes: true
        }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Get single product by ID or slug
  async getProduct(identifier) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    const product = await prisma.product.findUnique({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        variants: {
          include: {
            color: true,
            size: true
          }
        },
        colors: {
          orderBy: { sortOrder: 'asc' }
        },
        sizes: {
          orderBy: { sortOrder: 'asc' }
        },
        filterAttributes: true
      }
    });

    if (product) {
      // Increment view count
      await prisma.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } }
      });
    }

    return product;
  }

  // Create new product
  async createProduct(productData) {
    const {
      images = [],
      colors = [],
      sizes = [],
      variants = [],
      filterAttributes = [],
      ...productInfo
    } = productData;

    return await prisma.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          ...productInfo,
          hasVariants: variants.length > 0
        }
      });

      // Create images if provided
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img, index) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder || index,
            isPrimary: img.isPrimary || index === 0
          }))
        });
      }

      // Create colors if provided
      if (colors.length > 0) {
        await tx.productColor.createMany({
          data: colors.map((color, index) => ({
            productId: product.id,
            name: color.name,
            hexCode: color.hexCode,
            sortOrder: color.sortOrder || index
          }))
        });
      }

      // Create sizes if provided
      if (sizes.length > 0) {
        await tx.productSize.createMany({
          data: sizes.map((size, index) => ({
            productId: product.id,
            value: size.value,
            sizeType: size.sizeType || 'letter',
            sortOrder: size.sortOrder || index
          }))
        });
      }

      // Create variants if provided
      if (variants.length > 0) {
        for (const variant of variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              skuVariant: variant.skuVariant,
              colorId: variant.colorId,
              sizeId: variant.sizeId,
              price: variant.price,
              cost: variant.cost,
              stockQuantity: variant.stockQuantity || 0
            }
          });
        }
      }

      // Create filter attributes if provided
      if (filterAttributes.length > 0) {
        await tx.productFilterAttribute.createMany({
          data: filterAttributes.map(attr => ({
            productId: product.id,
            key: attr.key,
            value: attr.value
          }))
        });
      }

      // Update category product count
      if (product.categoryId) {
        await this.updateCategoryProductCount(product.categoryId, tx);
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          images: true,
          colors: true,
          sizes: true,
          variants: {
            include: {
              color: true,
              size: true
            }
          },
          filterAttributes: true
        }
      });
    });
  }

  // Update product
  async updateProduct(productId, updateData) {
    const {
      images,
      colors,
      sizes,
      variants,
      filterAttributes,
      ...productInfo
    } = updateData;

    return await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Update product basic info
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          ...productInfo,
          hasVariants: variants ? variants.length > 0 : existingProduct.hasVariants
        }
      });

      // Handle images update
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, index) => ({
              productId,
              url: img.url,
              alt: img.alt,
              sortOrder: img.sortOrder || index,
              isPrimary: img.isPrimary || index === 0
            }))
          });
        }
      }

      // Handle colors update
      if (colors !== undefined) {
        await tx.productColor.deleteMany({ where: { productId } });
        if (colors.length > 0) {
          await tx.productColor.createMany({
            data: colors.map((color, index) => ({
              productId,
              name: color.name,
              hexCode: color.hexCode,
              sortOrder: color.sortOrder || index
            }))
          });
        }
      }

      // Handle sizes update
      if (sizes !== undefined) {
        await tx.productSize.deleteMany({ where: { productId } });
        if (sizes.length > 0) {
          await tx.productSize.createMany({
            data: sizes.map((size, index) => ({
              productId,
              value: size.value,
              sizeType: size.sizeType || 'letter',
              sortOrder: size.sortOrder || index
            }))
          });
        }
      }

      // Handle variants update
      if (variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId } });
        if (variants.length > 0) {
          for (const variant of variants) {
            await tx.productVariant.create({
              data: {
                productId,
                skuVariant: variant.skuVariant,
                colorId: variant.colorId,
                sizeId: variant.sizeId,
                price: variant.price,
                cost: variant.cost,
                stockQuantity: variant.stockQuantity || 0
              }
            });
          }
        }
      }

      // Handle filter attributes update
      if (filterAttributes !== undefined) {
        await tx.productFilterAttribute.deleteMany({ where: { productId } });
        if (filterAttributes.length > 0) {
          await tx.productFilterAttribute.createMany({
            data: filterAttributes.map(attr => ({
              productId,
              key: attr.key,
              value: attr.value
            }))
          });
        }
      }

      // Update category product count if category changed
      if (productInfo.categoryId && productInfo.categoryId !== existingProduct.categoryId) {
        if (existingProduct.categoryId) {
          await this.updateCategoryProductCount(existingProduct.categoryId, tx);
        }
        await this.updateCategoryProductCount(productInfo.categoryId, tx);
      }

      return await tx.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          images: true,
          colors: true,
          sizes: true,
          variants: {
            include: {
              color: true,
              size: true
            }
          },
          filterAttributes: true
        }
      });
    });
  }

  // Delete product
  async deleteProduct(productId) {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      await tx.product.delete({
        where: { id: productId }
      });

      // Update category product count
      if (product.categoryId) {
        await this.updateCategoryProductCount(product.categoryId, tx);
      }

      return { message: 'Product deleted successfully' };
    });
  }

  // Update stock quantity
  async updateStock(productId, variantId, quantity, operation = 'set') {
    if (variantId) {
      const updateData = {};
      if (operation === 'increment') {
        updateData.stockQuantity = { increment: quantity };
      } else if (operation === 'decrement') {
        updateData.stockQuantity = { decrement: quantity };
      } else {
        updateData.stockQuantity = quantity;
      }

      return await prisma.productVariant.update({
        where: { id: variantId },
        data: updateData
      });
    } else {
      const updateData = {};
      if (operation === 'increment') {
        updateData.stockQuantity = { increment: quantity };
      } else if (operation === 'decrement') {
        updateData.stockQuantity = { decrement: quantity };
      } else {
        updateData.stockQuantity = quantity;
      }

      return await prisma.product.update({
        where: { id: productId },
        data: updateData
      });
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId,
          isActive: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          variants: {
            include: {
              color: true,
              size: true
            }
          }
        }
      }),
      prisma.product.count({
        where: {
          categoryId,
          isActive: true
        }
      })
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Search products
  async searchProducts(query, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const searchConditions = {
      AND: [
        { isActive: true },
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        }
      ]
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: searchConditions,
        skip,
        take: parseInt(limit),
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      }),
      prisma.product.count({ where: searchConditions })
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    return await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
  }

  // Helper method to update category product count
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
        minPrice: minPrice,
        maxPrice: maxPrice
      }
    });
  }
}

module.exports = new ProductService();