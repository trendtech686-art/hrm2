'use server'

/**
 * Server Actions for Products Management (Sản phẩm)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { serializeDecimals, type ApiSession } from '@/lib/api-utils'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { productFormSchema, updateProductFormSchema } from '@/features/products/validation'
import { logError } from '@/lib/logger'
import { syncSingleProductToPkgx } from '@/lib/pkgx/sync-service'
import { syncSingleProduct, deleteFromIndex } from '@/lib/meilisearch-sync'

// Types
type Product = NonNullable<Awaited<ReturnType<typeof prisma.product.findFirst>>>

// Helper to get user name from session (required for activity logging)
async function getUserNameFromSession(session: ApiSession): Promise<string> {
  // Try session.user.employee.fullName first (available if employee is linked)
  if (session.user.employee?.fullName) {
    return session.user.employee.fullName
  }
  
  // Try session.user.name (might be email or employee name from auth)
  if (session.user.name && session.user.name !== session.user.email) {
    return session.user.name
  }
  
  // Lookup from database using employeeId
  if (session.user.employeeId) {
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.employeeId },
      select: { fullName: true },
    })
    if (employee?.fullName) {
      return employee.fullName
    }
  }
  
  // Lookup from User table using user ID
  if (session.user.id) {
    const user = await prisma.user.findFirst({
      where: { systemId: session.user.id },
      select: { employee: { select: { fullName: true } } }
    })
    if (user?.employee?.fullName) {
      return user.employee.fullName
    }
  }
  
  // Return email as last resort (not null, always have some identifier)
  return session.user.email || session.user.id
}

export type CreateProductInput = {
  id?: string
  name: string
  description?: string
  shortDescription?: string
  thumbnailImage?: string
  imageUrl?: string
  galleryImages?: string[]
  type?: string
  brandId?: string
  unit?: string
  costPrice?: number
  isStockTracked?: boolean
  reorderLevel?: number
  safetyStock?: number
  maxStock?: number
  weight?: number
  weightUnit?: string
  barcode?: string
  warrantyPeriodMonths?: number
  primarySupplierId?: string
  isPublished?: boolean
  isFeatured?: boolean
  sortOrder?: number
  seoDescription?: string
  seoKeywords?: string
  slug?: string
  ktitle?: string
  videoLinks?: string[]
  seoPkgx?: unknown
  seoTrendtech?: unknown
  productTypeSystemId?: string
  categorySystemIds?: string[]
  categories?: string[]
  subCategory?: string
  subCategories?: string[]
  warehouseLocation?: string
  storageLocationSystemId?: string
  tags?: string[]
  pkgxId?: number
  trendtechId?: number
  dimensions?: unknown
  createdBy?: string
  // Label/Tem phụ fields
  nameVat?: string
  origin?: string
  importerSystemId?: string
  importerName?: string
  importerAddress?: string
  usageGuide?: string
  // Prices: Record<pricingPolicyId, priceValue>
  prices?: Record<string, number>
  // Inventory: Record<branchSystemId, quantity>
  inventoryByBranch?: Record<string, number>
  // Combo fields
  comboItems?: Array<{ productSystemId: string; quantity: number }>
  comboPricingType?: string
  comboDiscount?: number
}

export type UpdateProductInput = {
  systemId: string
  id?: string
  name?: string
  description?: string
  shortDescription?: string
  thumbnailImage?: string
  imageUrl?: string
  galleryImages?: string[]
  type?: string
  brandId?: string | null
  unit?: string
  costPrice?: number
  lastPurchasePrice?: number
  isStockTracked?: boolean
  reorderLevel?: number
  safetyStock?: number
  maxStock?: number
  weight?: number
  weightUnit?: string
  barcode?: string
  warrantyPeriodMonths?: number
  primarySupplierId?: string | null
  isPublished?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  isBestSeller?: boolean
  isNewArrival?: boolean
  publishedAt?: string | Date | null
  launchedDate?: string | Date | null
  discontinuedDate?: string | Date | null
  sortOrder?: number
  seoDescription?: string
  seoKeywords?: string
  slug?: string
  status?: string
  ktitle?: string
  videoLinks?: string[]
  seoPkgx?: unknown
  seoTrendtech?: unknown
  productTypeSystemId?: string
  categorySystemIds?: string[]
  categories?: string[]
  subCategory?: string
  subCategories?: string[]
  warehouseLocation?: string
  storageLocationSystemId?: string
  tags?: string[]
  pkgxId?: number
  trendtechId?: number
  dimensions?: unknown
  updatedBy?: string
  // Internal notes and label fields
  sellerNote?: string
  nameVat?: string
  origin?: string
  importerName?: string
  importerAddress?: string
  usageGuide?: string
  // Prices: Record<pricingPolicyId, priceValue>
  prices?: Record<string, number>
  // Combo fields
  comboItems?: Array<{ productSystemId: string; quantity: number }>
  comboPricingType?: string
  comboDiscount?: number
}
// ACTIONS
// ====================================

export async function createProductAction(
  input: CreateProductInput
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('create_products')
  if (!authResult.success) return authResult
  const session = authResult.session
  const validated = productFormSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('SP', prisma)

    const product = await prisma.product.create({
      data: {
        systemId,
        id: input.id || systemId,
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription,
        thumbnailImage: input.thumbnailImage,
        imageUrl: input.imageUrl,
        galleryImages: input.galleryImages ?? [],
        type: (input.type?.toUpperCase() || 'PHYSICAL') as 'PHYSICAL' | 'SERVICE' | 'DIGITAL' | 'COMBO',
        brandId: input.brandId,
        unit: input.unit ?? 'Cái',
        costPrice: input.costPrice ?? 0,
        lastPurchasePrice: input.costPrice ?? 0,
        lastPurchaseDate: new Date(),
        isStockTracked: input.isStockTracked ?? true,
        reorderLevel: input.reorderLevel,
        safetyStock: input.safetyStock,
        maxStock: input.maxStock,
        weight: input.weight,
        weightUnit: (input.weightUnit === 'kg' || input.weightUnit === 'KILOGRAM') ? 'KILOGRAM' : 'GRAM',
        barcode: input.barcode,
        warrantyPeriodMonths: input.warrantyPeriodMonths ?? 12,
        primarySupplierId: input.primarySupplierId,
        isPublished: input.isPublished ?? false,
        isFeatured: input.isFeatured ?? false,
        sortOrder: input.sortOrder,
        seoDescription: input.seoDescription,
        seoKeywords: input.seoKeywords,
        slug: input.slug,
        ktitle: input.ktitle,
        videoLinks: input.videoLinks ?? [],
        seoPkgx: input.seoPkgx as never,
        seoTrendtech: input.seoTrendtech as never,
        productTypeSystemId: input.productTypeSystemId,
        categorySystemIds: input.categorySystemIds ?? [],
        categories: input.categories ?? [],
        subCategory: input.subCategory,
        subCategories: input.subCategories ?? [],
        warehouseLocation: input.warehouseLocation,
        storageLocationSystemId: input.storageLocationSystemId,
        tags: input.tags ?? [],
        pkgxId: input.pkgxId,
        trendtechId: input.trendtechId,
        dimensions: input.dimensions as never,
        createdBy: input.createdBy,
        // Label/Tem phụ fields
        nameVat: input.nameVat,
        origin: input.origin,
        importerSystemId: input.importerSystemId,
        importerName: input.importerName,
        importerAddress: input.importerAddress,
        usageGuide: input.usageGuide,
        // Combo fields
        comboItems: input.comboItems ? (input.comboItems as never) : undefined,
        comboPricingType: input.comboPricingType,
        comboDiscount: input.comboDiscount,
        // Inventory cache
        inventoryByBranch: input.inventoryByBranch ? (input.inventoryByBranch as never) : undefined,
      },
    })

    // Create ProductInventory + StockHistory for all branches
    const allBranches = await prisma.branch.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true },
    })

    if (allBranches.length > 0) {
      const initialInventory = input.inventoryByBranch || {}

      await prisma.productInventory.createMany({
        data: allBranches.map(branch => ({
          productId: systemId,
          branchId: branch.systemId,
          onHand: Number(initialInventory[branch.systemId]) || 0,
          committed: 0,
          inTransit: 0,
        })),
        skipDuplicates: true,
      })

      // Resolve employee info for stock history
      let employeeName = 'Hệ thống'
      if (input.createdBy) {
        const emp = await prisma.employee.findUnique({
          where: { systemId: input.createdBy },
          select: { fullName: true },
        })
        if (emp?.fullName) employeeName = emp.fullName
      }

      await prisma.stockHistory.createMany({
        data: allBranches.map(branch => {
          const qty = Number(initialInventory[branch.systemId]) || 0
          return {
            productId: systemId,
            branchId: branch.systemId,
            action: 'Khởi tạo sản phẩm',
            source: 'Tạo mới sản phẩm',
            quantityChange: qty,
            newStockLevel: qty,
            documentId: product.id,
            documentType: 'product_create',
            employeeId: input.createdBy || null,
            employeeName,
            note: 'Tạo mới sản phẩm từ HRM',
          }
        }),
      })
    }

    // Create ProductPrice records from form prices
    if (input.prices && typeof input.prices === 'object' && Object.keys(input.prices).length > 0) {
      for (const [pricingPolicyId, priceValue] of Object.entries(input.prices)) {
        if (priceValue !== undefined && priceValue !== null && Number(priceValue) >= 0) {
          await prisma.productPrice.upsert({
            where: {
              productId_pricingPolicyId: {
                productId: systemId,
                pricingPolicyId,
              },
            },
            update: { price: Number(priceValue) },
            create: {
              productId: systemId,
              pricingPolicyId,
              price: Number(priceValue),
            },
          })
        }
      }
    }

    // Fire-and-forget activity log
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'product',
          entityId: systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo sản phẩm mới: ${product.name || ''} (${product.id})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/products')

    // Fire-and-forget: sync to Meilisearch
    syncSingleProduct(systemId).catch(e => logError('[Meilisearch] Product create sync failed', e))

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    logError('Error creating product', error)
    const errMsg = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `Không thể tạo sản phẩm: ${errMsg}`,
    }
  }
}

export async function updateProductAction(
  input: UpdateProductInput
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const session = authResult.session
  const validated = updateProductFormSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    // Check duplicate SKU if changing id
    if (data.id !== undefined && data.id !== existing.id) {
      const duplicateProduct = await prisma.product.findFirst({
        where: { id: data.id, isDeleted: false, systemId: { not: systemId } },
        select: { systemId: true },
      })
      if (duplicateProduct) {
        return { success: false, error: `Mã SKU "${data.id}" đã tồn tại` }
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.id !== undefined) updateData.id = data.id
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
    if (data.thumbnailImage !== undefined) updateData.thumbnailImage = data.thumbnailImage
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages
    if (data.type !== undefined) updateData.type = (data.type as string).toUpperCase() as 'PHYSICAL' | 'SERVICE' | 'DIGITAL' | 'COMBO'
    if (data.brandId !== undefined) updateData.brandId = data.brandId
    if (data.unit !== undefined) updateData.unit = data.unit
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice
    if (data.lastPurchasePrice !== undefined) updateData.lastPurchasePrice = data.lastPurchasePrice
    if (data.isStockTracked !== undefined) updateData.isStockTracked = data.isStockTracked
    if (data.reorderLevel !== undefined) updateData.reorderLevel = data.reorderLevel
    if (data.safetyStock !== undefined) updateData.safetyStock = data.safetyStock
    if (data.maxStock !== undefined) updateData.maxStock = data.maxStock
    if (data.weight !== undefined) updateData.weight = data.weight
    if (data.weightUnit !== undefined) updateData.weightUnit = (data.weightUnit === 'g' || data.weightUnit === 'GRAM') ? 'GRAM' : 'KILOGRAM'
    if (data.barcode !== undefined) updateData.barcode = data.barcode
    if (data.warrantyPeriodMonths !== undefined) updateData.warrantyPeriodMonths = data.warrantyPeriodMonths
    if (data.primarySupplierId !== undefined) updateData.primarySupplierId = data.primarySupplierId
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.isOnSale !== undefined) updateData.isOnSale = data.isOnSale
    if (data.isBestSeller !== undefined) updateData.isBestSeller = data.isBestSeller
    if (data.isNewArrival !== undefined) updateData.isNewArrival = data.isNewArrival
    if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
    if (data.launchedDate !== undefined) updateData.launchedDate = data.launchedDate ? new Date(data.launchedDate) : null
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.status !== undefined) updateData.status = (data.status as string).toUpperCase()
    if (data.ktitle !== undefined) updateData.ktitle = data.ktitle
    if (data.videoLinks !== undefined) updateData.videoLinks = data.videoLinks
    if (data.seoPkgx !== undefined) updateData.seoPkgx = data.seoPkgx
    if (data.seoTrendtech !== undefined) updateData.seoTrendtech = data.seoTrendtech
    if (data.productTypeSystemId !== undefined) updateData.productTypeSystemId = data.productTypeSystemId
    if (data.categorySystemIds !== undefined) updateData.categorySystemIds = data.categorySystemIds
    if (data.categories !== undefined) updateData.categories = data.categories
    if (data.subCategory !== undefined) updateData.subCategory = data.subCategory
    if (data.subCategories !== undefined) updateData.subCategories = data.subCategories
    if (data.warehouseLocation !== undefined) updateData.warehouseLocation = data.warehouseLocation
    if (data.storageLocationSystemId !== undefined) updateData.storageLocationSystemId = data.storageLocationSystemId
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.pkgxId !== undefined) updateData.pkgxId = data.pkgxId
    if (data.trendtechId !== undefined) updateData.trendtechId = data.trendtechId
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy
    // Auto-set updatedBy from session if not explicitly provided
    if (!updateData.updatedBy) {
      const empId = (session.user as { employeeId?: string })?.employeeId
      if (empId) updateData.updatedBy = empId
    }
    // Internal notes and label fields
    if (data.sellerNote !== undefined) updateData.sellerNote = data.sellerNote
    if (data.discontinuedDate !== undefined) updateData.discontinuedDate = data.discontinuedDate ? new Date(data.discontinuedDate) : null
    if (data.nameVat !== undefined) updateData.nameVat = data.nameVat
    if (data.origin !== undefined) updateData.origin = data.origin
    if (data.importerName !== undefined) updateData.importerName = data.importerName
    if (data.importerAddress !== undefined) updateData.importerAddress = data.importerAddress
    if (data.usageGuide !== undefined) updateData.usageGuide = data.usageGuide
    // Combo fields
    if (data.comboItems !== undefined) updateData.comboItems = data.comboItems
    if (data.comboPricingType !== undefined) updateData.comboPricingType = data.comboPricingType
    if (data.comboDiscount !== undefined) updateData.comboDiscount = data.comboDiscount

    const product = await prisma.product.update({
      where: { systemId },
      data: updateData,
    })

    // Upsert prices into ProductPrice table
    if (data.prices && typeof data.prices === 'object' && Object.keys(data.prices).length > 0) {
      for (const [pricingPolicyId, priceValue] of Object.entries(data.prices)) {
        if (priceValue !== undefined && priceValue !== null && Number(priceValue) >= 0) {
          await prisma.productPrice.upsert({
            where: {
              productId_pricingPolicyId: {
                productId: systemId,
                pricingPolicyId,
              },
            },
            update: { price: Number(priceValue) },
            create: {
              productId: systemId,
              pricingPolicyId,
              price: Number(priceValue),
            },
          })
        }
      }
    }

    // Log activity: compute changed fields
    {
      // Helper to normalize values for comparison
      // Treats null, undefined, "", [], {} as equivalent "empty" to avoid false changes
      const isEmptyValue = (val: unknown): boolean => {
        if (val === null || val === undefined) return true;
        if (typeof val === 'string' && val.trim() === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return true;
        return false;
      };
      const normalizeForCompare = (val: unknown): string => {
        if (isEmptyValue(val)) return 'null';
        if (val instanceof Date) {
          return val.toISOString().split('T')[0];
        }
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
          return val.split('T')[0];
        }
        // Handle Decimal types from Prisma
        if (typeof val === 'object' && val !== null && 'toNumber' in val) {
          return String((val as { toNumber: () => number }).toNumber());
        }
        if (typeof val === 'number') return String(val);
        return JSON.stringify(val);
      };
      
      const changes: Record<string, { from: unknown; to: unknown }> = {}
      for (const key of Object.keys(updateData)) {
        if (key === 'updatedAt' || key === 'updatedBy') continue;
        const oldVal = (existing as Record<string, unknown>)[key]
        const newVal = (product as Record<string, unknown>)[key]
        if (normalizeForCompare(oldVal) !== normalizeForCompare(newVal)) {
          // Convert Decimal to number for storage
          const serializedOld = typeof oldVal === 'object' && oldVal !== null && 'toNumber' in oldVal
            ? (oldVal as { toNumber: () => number }).toNumber()
            : oldVal ?? null;
          const serializedNew = typeof newVal === 'object' && newVal !== null && 'toNumber' in newVal
            ? (newVal as { toNumber: () => number }).toNumber()
            : newVal ?? null;
          changes[key] = { from: serializedOld, to: serializedNew }
        }
      }
      if (Object.keys(changes).length > 0) {
        const fieldLabels: Record<string, string> = {
          id: 'Mã SKU', name: 'Tên sản phẩm', description: 'Mô tả', shortDescription: 'Mô tả ngắn',
          thumbnailImage: 'Ảnh thumbnail', imageUrl: 'Ảnh chính', galleryImages: 'Ảnh gallery',
          type: 'Loại', brandId: 'Thương hiệu', unit: 'Đơn vị', costPrice: 'Giá vốn',
          lastPurchasePrice: 'Giá nhập gần nhất', isStockTracked: 'Theo dõi tồn kho',
          reorderLevel: 'Mức đặt hàng lại', safetyStock: 'Tồn kho an toàn', maxStock: 'Tồn kho tối đa',
          weight: 'Trọng lượng', weightUnit: 'Đơn vị trọng lượng', barcode: 'Mã vạch',
          warrantyPeriodMonths: 'Bảo hành (tháng)', primarySupplierId: 'Nhà cung cấp chính',
          isPublished: 'Đăng bán', isFeatured: 'Nổi bật', status: 'Trạng thái',
          categories: 'Danh mục', tags: 'Thẻ', slug: 'Slug', ktitle: 'Tiêu đề SEO',
          isOnSale: 'Đang giảm giá', isBestSeller: 'Bán chạy', isNewArrival: 'Mới về',
          publishedAt: 'Ngày đăng web', launchedDate: 'Ngày ra mắt', sortOrder: 'Thứ tự hiển thị',
          discontinuedDate: 'Ngày ngừng kinh doanh',
          productTypeSystemId: 'Loại sản phẩm', storageLocationSystemId: 'Vị trí kho',
          dimensions: 'Kích thước', videoLinks: 'Link video',
          sellerNote: 'Ghi chú nội bộ',
          seoDescription: 'Mô tả SEO', seoKeywords: 'Từ khóa SEO',
          nameVat: 'Tên hàng hóa (VAT)', origin: 'Xuất xứ',
          importerName: 'Đơn vị nhập khẩu', importerAddress: 'Địa chỉ nhập khẩu',
          usageGuide: 'Hướng dẫn sử dụng',
        };

        // Convert boolean values to Vietnamese text
        const booleanLabels: Record<string, [string, string]> = {
          isPublished: ['Không', 'Có'], isFeatured: ['Không', 'Có'],
          isOnSale: ['Không', 'Có'], isBestSeller: ['Không', 'Có'],
          isNewArrival: ['Không', 'Có'], isStockTracked: ['Không', 'Có'],
        };
        const displayChanges = { ...changes };
        for (const [key, labels] of Object.entries(booleanLabels)) {
          if (displayChanges[key]) {
            displayChanges[key] = {
              from: typeof displayChanges[key].from === 'boolean' ? labels[displayChanges[key].from ? 1 : 0] : displayChanges[key].from,
              to: typeof displayChanges[key].to === 'boolean' ? labels[displayChanges[key].to ? 1 : 0] : displayChanges[key].to,
            };
          }
        }

        const changedFieldNames = Object.keys(changes)
          .map(k => fieldLabels[k] || k)
          .slice(0, 5);
        const suffix = Object.keys(changes).length > 5 ? ` và ${Object.keys(changes).length - 5} trường khác` : '';
        const note = `Cập nhật thông tin sản phẩm: ${changedFieldNames.join(', ')}${suffix}`;
        
        // Fire-and-forget activity log
        getUserNameFromSession(session).then(userName =>
          prisma.activityLog.create({
            data: {
              entityType: 'product',
              entityId: systemId,
              action: 'updated',
              actionType: 'update',
              changes: JSON.parse(JSON.stringify(displayChanges)),
              note,
              metadata: { userName },
              createdBy: userName,
            },
          })
        ).catch(e => logError('Activity log failed', e))
      }
    }

    revalidatePath('/products')
    revalidatePath(`/products/${systemId}`)

    // Fire-and-forget: sync to PKGX if enabled
    syncSingleProductToPkgx(systemId).catch(e => logError('[PKGX] Real-time sync failed', e))

    // Fire-and-forget: sync to Meilisearch
    syncSingleProduct(systemId).catch(e => logError('[Meilisearch] Product update sync failed', e))

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    logError('Error updating product', error)
    return {
      success: false,
      error: 'Không thể cập nhật sản phẩm. Vui lòng thử lại.',
    }
  }
}

export async function deleteProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('delete_products')
  if (!authResult.success) return authResult
  const session = authResult.session
  try {
    const existing = await prisma.product.findUnique({ where: { systemId }, select: { name: true, id: true } });
    const product = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    })

    // Fire-and-forget activity log
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'product',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa sản phẩm: ${existing?.name || ''} (${existing?.id || systemId})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/products')

    // Fire-and-forget: remove from Meilisearch
    deleteFromIndex('products', systemId).catch(e => logError('[Meilisearch] Product delete sync failed', e))

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    logError('Error deleting product', error)
    return {
      success: false,
      error: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
    }
  }
}

export async function restoreProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const session = authResult.session
  try {
    const product = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        status: 'ACTIVE',
      },
    })

    // Fire-and-forget activity log
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'product',
          entityId: systemId,
          action: 'restored',
          actionType: 'update',
          note: `Khôi phục sản phẩm: ${product.name || ''} (${product.id || systemId})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/products')

    // Fire-and-forget: sync restored product back to Meilisearch
    syncSingleProduct(systemId).catch(e => logError('[Meilisearch] Product restore sync failed', e))

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    logError('Error restoring product', error)
    return {
      success: false,
      error: 'Không thể khôi phục sản phẩm. Vui lòng thử lại.',
    }
  }
}

export async function getProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('view_products')
  if (!authResult.success) return authResult
  try {
    const product = await prisma.product.findUnique({
      where: { systemId },
      include: {
        brand: true,
        prices: true,
      },
    })

    if (!product) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    logError('Error getting product', error)
    return {
      success: false,
      error: 'Không thể tải sản phẩm. Vui lòng thử lại.',
    }
  }
}

export async function updateProductInventoryAction(
  systemId: string,
  branchSystemId: string,
  quantity: number,
  operation: 'set' | 'add' | 'subtract'
): Promise<ActionResult<Product>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult
  try {
    const product = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!product) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    const currentInventory = (product.inventoryByBranch as Record<string, number>) ?? {}
    const currentQty = currentInventory[branchSystemId] ?? 0

    let newQty: number
    switch (operation) {
      case 'set':
        newQty = quantity
        break
      case 'add':
        newQty = currentQty + quantity
        break
      case 'subtract':
        newQty = Math.max(0, currentQty - quantity)
        break
    }

    const newInventory = { ...currentInventory, [branchSystemId]: newQty }
    const totalInventory = Object.values(newInventory).reduce((sum, qty) => sum + qty, 0)

    const updated = await prisma.product.update({
      where: { systemId },
      data: {
        inventoryByBranch: newInventory,
        totalInventory,
        totalAvailable: totalInventory - (product.totalCommitted ?? 0),
        inventoryUpdatedAt: new Date(),
      },
    })

    revalidatePath('/products')
    revalidatePath(`/products/${systemId}`)
    return { success: true, data: serializeDecimals(updated) }
  } catch (error) {
    logError('Error updating product inventory', error)
    return {
      success: false,
      error: 'Không thể cập nhật tồn kho. Vui lòng thử lại.',
    }
  }
}
