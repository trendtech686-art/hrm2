import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// Transform Prisma Product to frontend-compatible format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformProduct(product: any): any {
  if (!product) return product;
  
  const result = { ...product };
  
  // Convert Decimal fields to numbers
  if (product.costPrice != null) {
    result.costPrice = Number(product.costPrice);
  }
  if (product.lastPurchasePrice != null) {
    result.lastPurchasePrice = Number(product.lastPurchasePrice);
  }
  if (product.weight != null) {
    result.weight = Number(product.weight);
  }
  if (product.sellingPrice != null) {
    result.sellingPrice = Number(product.sellingPrice);
  }
  if (product.comboDiscount != null) {
    result.comboDiscount = Number(product.comboDiscount);
  }
  
  // Convert Date fields to ISO string for consistent frontend handling
  if (product.lastPurchaseDate != null) {
    result.lastPurchaseDate = product.lastPurchaseDate instanceof Date 
      ? product.lastPurchaseDate.toISOString() 
      : product.lastPurchaseDate;
  }
  
  // Transform productInventory array to inventoryByBranch Record
  // ProductInventory has: productId, branchId, onHand, committed, inTransit, inDelivery
  if (Array.isArray(product.productInventory)) {
    const inventoryByBranch: Record<string, number> = {};
    const committedByBranch: Record<string, number> = {};
    const inTransitByBranch: Record<string, number> = {};
    const inDeliveryByBranch: Record<string, number> = {};
    let totalInventory = 0;
    for (const inv of product.productInventory) {
      const branchId = inv.branchId || inv.branchSystemId;
      const onHand = Number(inv.onHand || inv.quantity || 0);
      if (branchId) {
        inventoryByBranch[branchId] = onHand;
        committedByBranch[branchId] = Number(inv.committed || 0);
        inTransitByBranch[branchId] = Number(inv.inTransit || 0);
        inDeliveryByBranch[branchId] = Number(inv.inDelivery || 0);
      }
      totalInventory += onHand;
    }
    result.inventoryByBranch = inventoryByBranch;
    result.committedByBranch = committedByBranch;
    result.inTransitByBranch = inTransitByBranch;
    result.inDeliveryByBranch = inDeliveryByBranch;
    result.totalInventory = totalInventory;
  }
  
  // Transform prices from array to Record<policySystemId, number>
  const pricesArray = product.prices;
  if (Array.isArray(pricesArray)) {
    const pricesRecord: Record<string, number> = {};
    for (const pp of pricesArray) {
      if (pp.pricingPolicyId && pp.price != null) {
        pricesRecord[pp.pricingPolicyId] = Number(pp.price);
      }
    }
    result.prices = pricesRecord;
  }
  
  // Map brandId to brandSystemId (frontend expects brandSystemId)
  if (product.brandId) {
    result.brandSystemId = product.brandId;
  }
  
  // Map productCategories to categorySystemId (first one) and categorySystemIds
  if (Array.isArray(product.productCategories) && product.productCategories.length > 0) {
    result.categorySystemId = product.productCategories[0].categoryId;
    result.categorySystemIds = product.productCategories.map((pc: { categoryId: string }) => pc.categoryId);
  }
  
  return result;
}

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/products/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const product = await prisma.product.findUnique({
      where: { systemId },
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
        productInventory: true,
        prices: {
          include: {
            pricingPolicy: true,
          },
        },
      },
    })

    if (!product) {
      return apiNotFound('Product')
    }

    // Transform to frontend-compatible format
    return apiSuccess(transformProduct(product))
  } catch (error) {
    console.error('Error fetching product:', error)
    return apiError('Failed to fetch product', 500)
  }
}

// PATCH /api/products/[systemId]
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Extract special fields that need separate handling
    const { categoryIds, brandId, pkgxId, prices, ...updateData } = body
    
    // Remove fields that shouldn't be directly updated
    // Note: 'id' is the SKU field in database and CAN be updated
    const fieldsToRemove = [
      'systemId', 'createdAt', 'brand', 'productCategories', 'productInventory',
      'categorySystemIds', 'categories', 'subCategory', 'subCategories',
      'inventoryByBranch', 'committedByBranch', 'inTransitByBranch',
      'brandSystemId', 'categorySystemId', // These are handled separately
      'variants', 'comboItems',
      'sku', 'pkgxSku', // Legacy fields - removed from schema
    ]
    for (const field of fieldsToRemove) {
      delete updateData[field]
    }
    
    // Handle enum fields - convert string to proper enum value
    if (updateData.type !== undefined) {
      // Prisma expects uppercase enum: PHYSICAL, DIGITAL, SERVICE, COMBO
      const typeMap: Record<string, string> = {
        'physical': 'PHYSICAL',
        'digital': 'DIGITAL', 
        'service': 'SERVICE',
        'combo': 'COMBO',
      }
      updateData.type = typeMap[updateData.type?.toLowerCase()] || updateData.type?.toUpperCase() || 'PHYSICAL'
    }
    
    // Handle weightUnit enum
    if (updateData.weightUnit !== undefined) {
      const weightUnitMap: Record<string, string> = {
        'g': 'GRAM',
        'gram': 'GRAM',
        'kg': 'KILOGRAM',
        'kilogram': 'KILOGRAM',
        'lb': 'POUND',
        'pound': 'POUND',
        'oz': 'OUNCE',
        'ounce': 'OUNCE',
      }
      updateData.weightUnit = weightUnitMap[updateData.weightUnit?.toLowerCase()] || updateData.weightUnit?.toUpperCase() || 'GRAM'
    }
    
    // Handle status enum
    if (updateData.status !== undefined) {
      updateData.status = updateData.status?.toUpperCase() || 'ACTIVE'
    }
    
    // Handle comboPricingType enum  
    if (updateData.comboPricingType !== undefined) {
      const comboPricingMap: Record<string, string> = {
        'fixed': 'FIXED',
        'percentage': 'PERCENTAGE',
        'sum': 'SUM',
      }
      updateData.comboPricingType = comboPricingMap[updateData.comboPricingType?.toLowerCase()] || updateData.comboPricingType?.toUpperCase() || 'FIXED'
    }
    
    // Handle date fields - convert string to Date object
    const dateFields = ['publishedAt', 'launchedDate', 'discontinuedDate', 'lastPurchaseDate', 'lastSoldDate', 'deletedAt']
    for (const field of dateFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        if (typeof updateData[field] === 'string') {
          // Convert string to ISO DateTime
          const dateStr = updateData[field] as string
          // If it's just a date (YYYY-MM-DD), add time component
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            updateData[field] = new Date(dateStr + 'T00:00:00.000Z')
          } else {
            updateData[field] = new Date(dateStr)
          }
        }
      }
    }

    // Build update object
    const data: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    }

    // Handle pkgxId - allow setting to null explicitly
    if (pkgxId !== undefined) {
      data.pkgxId = pkgxId === null || pkgxId === undefined ? null : pkgxId
    }

    // Handle brand connection
    if (brandId !== undefined) {
      data.brand = brandId 
        ? { connect: { systemId: brandId } } 
        : { disconnect: true }
    }

    // Handle image fields mapping
    if (body.thumbnailImage !== undefined) {
      data.thumbnailImage = body.thumbnailImage
      data.imageUrl = body.thumbnailImage
    }
    if (body.galleryImages !== undefined) {
      data.galleryImages = body.galleryImages
    }
    if (body.images !== undefined) {
      data.galleryImages = body.images
    }

    const product = await prisma.product.update({
      where: { systemId },
      data,
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await prisma.productCategory.deleteMany({
        where: { productId: systemId },
      })

      // Add new categories
      if (categoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: systemId,
            categoryId,
          })),
        })
      }
    }

    // Update prices if provided
    // prices is expected to be Record<pricingPolicyId, priceValue>
    if (prices && typeof prices === 'object' && Object.keys(prices).length > 0) {
      for (const [pricingPolicyId, priceValue] of Object.entries(prices)) {
        if (priceValue !== undefined && priceValue !== null) {
          // Upsert: update if exists, create if not
          await prisma.productPrice.upsert({
            where: {
              productId_pricingPolicyId: {
                productId: systemId,
                pricingPolicyId,
              },
            },
            update: {
              price: Number(priceValue),
            },
            create: {
              productId: systemId,
              pricingPolicyId,
              price: Number(priceValue),
            },
          })
        }
      }
    }

    return apiSuccess(transformProduct(product))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Product')
    }
    console.error('[PATCH Product] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Failed to update product: ${errorMessage}`, 500)
  }
}

// DELETE /api/products/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.product.update({
      where: { systemId },
      data: { 
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Product')
    }
    console.error('Error deleting product:', error)
    return apiError('Failed to delete product', 500)
  }
}
