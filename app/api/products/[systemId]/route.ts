import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { updateProductSchema } from '../validation'
import { transformProduct } from '../transform'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// GET /api/products/[systemId]
export const GET = apiHandler(async (_request, { params }) => {
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
    const transformed = transformProduct(product)

    // Resolve employee names
    const empIds = [product.createdBy, product.updatedBy].filter(Boolean) as string[]
    const emps = empIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: empIds } },
          select: { systemId: true, fullName: true },
        })
      : []
    const empMap = new Map(emps.map(e => [e.systemId, e.fullName]))

    return apiSuccess({
      ...transformed,
      createdByName: empMap.get(product.createdBy || '') || null,
      updatedByName: empMap.get(product.updatedBy || '') || null,
    })
})

// PATCH /api/products/[systemId]
export const PATCH = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = await params
    const body = await request.json()

    // Validate body with Zod (reject obviously bad input)
    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(parsed.error.issues.map(e => e.message).join(', '), 400)
    }

    // ⚡ Get existing product for activity log comparison
    const existingProduct = await prisma.product.findUnique({
      where: { systemId },
      select: {
        name: true,
        id: true,
        status: true,
        type: true,
        costPrice: true,
        description: true,
        unit: true,
        brandId: true,
      },
    })
    if (!existingProduct) {
      return apiNotFound('Product')
    }

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

    // ⚡ Create activity log for product update
    const isEmptyVal = (v: unknown) => v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)
    const changes: Record<string, { from?: unknown; to?: unknown }> = {}
    const fieldsToTrack = ['name', 'id', 'status', 'type', 'costPrice', 'description', 'unit']
    for (const field of fieldsToTrack) {
      const oldVal = existingProduct[field as keyof typeof existingProduct]
      const newVal = body[field]
      if (newVal === undefined) continue
      if (isEmptyVal(oldVal) && isEmptyVal(newVal)) continue
      if (oldVal !== newVal) {
        changes[field] = { from: oldVal, to: newVal }
      }
    }
    // Track brand changes
    if (brandId !== undefined && !(isEmptyVal(existingProduct.brandId) && isEmptyVal(brandId)) && existingProduct.brandId !== brandId) {
      changes['brandId'] = { from: existingProduct.brandId, to: brandId }
    }

    // Only create log if there are actual changes
    if (Object.keys(changes).length > 0) {
      const fieldLabels: Record<string, string> = {
        name: 'Tên sản phẩm', id: 'Mã SKU', status: 'Trạng thái', type: 'Loại',
        costPrice: 'Giá vốn', description: 'Mô tả', unit: 'Đơn vị', brandId: 'Thương hiệu',
      }
      const displayChanges: Record<string, { from?: unknown; to?: unknown }> = {}
      for (const [key, val] of Object.entries(changes)) {
        displayChanges[fieldLabels[key] || key] = val
      }
      prisma.activityLog.create({
        data: {
          entityType: 'product',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          changes: displayChanges as Prisma.InputJsonValue,
          createdBy: getSessionUserName(session),
        },
      }).catch(e => logError('Activity log failed', e))
    }

    return apiSuccess(transformProduct(product))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Sản phẩm')
    }
    throw error
  }
}, { permission: 'edit_products' })

// DELETE /api/products/[systemId]
export const DELETE = apiHandler(async (_request, { params }) => {
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
      return apiNotFound('Sản phẩm')
    }
    throw error
  }
}, { permission: 'delete_products' })
