import { prisma } from '@/lib/prisma'
import { Prisma, ProductType, ProductStatus } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const productItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  pkgxId: z.number(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  thumbnailImage: z.string().optional(),
  imageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  type: z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL', 'COMBO']).optional(),
  brandId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  unit: z.string().optional(),
  costPrice: z.number().optional(),
  sellingPrice: z.number().optional(),
  lastPurchasePrice: z.number().optional(),
  lastPurchaseDate: z.string().optional(),
  reorderLevel: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['GRAM', 'KILOGRAM']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ktitle: z.string().optional(),
  sellerNote: z.string().optional(),
  createdAt: z.string().optional(),
  seoPkgx: z.any().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  launchedDate: z.string().optional(),
  publishedAt: z.string().optional(),
  pkgxPrices: z.object({
    shop_price: z.number().optional(),
    market_price: z.number().optional(),
    partner_price: z.number().optional(),
    ace_price: z.number().optional(),
    deal_price: z.number().optional(),
  }).optional(),
})

const bulkImportSchema = z.object({
  products: z.array(productItemSchema).min(1).max(200),
})

/**
 * POST /api/products/bulk-import
 * Import nhiều sản phẩm PKGX → HRM cùng lúc (batch 50)
 * Client gửi batch 200 SP → server xử lý từng SP trong transaction
 */
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, bulkImportSchema)
  if (!result.success) return apiError(result.error, 400)

  const { products } = result.data

  // Pre-load shared data once
  const [defaultProductType, allBranches, existingProducts, priceMappings, defaultImporter, logisticsSetting] = await Promise.all([
    prisma.settingsData.findFirst({
      where: { type: 'product-type', isActive: true, isDeleted: false, isDefault: true },
      select: { systemId: true },
    }).then(pt => pt ?? prisma.settingsData.findFirst({
      where: { type: 'product-type', isActive: true, isDeleted: false },
      orderBy: { name: 'asc' },
      select: { systemId: true },
    })),
    prisma.branch.findMany({
      where: { isDeleted: false },
      select: { systemId: true, name: true },
    }),
    prisma.product.findMany({
      where: {
        OR: [
          { pkgxId: { in: products.map(p => p.pkgxId) } },
          { id: { in: products.map(p => p.id).filter(Boolean) as string[] } },
        ],
        isDeleted: false,
      },
      select: { systemId: true, id: true, pkgxId: true },
    }),
    prisma.pkgxPriceMapping.findMany({
      where: { isActive: true },
    }),
    // Fetch default importer for tem phụ
    prisma.settingsData.findFirst({
      where: { type: 'importer', isDeleted: false, isDefault: true, isActive: true },
      select: { systemId: true, name: true, metadata: true },
    }),
    // Fetch logistics settings for default weight/dimensions
    prisma.setting.findFirst({
      where: { key: 'logistics-settings' },
      select: { value: true },
    }),
  ])

  const productTypeSystemId = defaultProductType?.systemId

  // Parse logistics defaults
  const logisticsDefaults = (logisticsSetting?.value as Record<string, unknown>)?.physicalDefaults as {
    weight?: number; weightUnit?: string; length?: number; width?: number; height?: number
  } | undefined
  const comboDefaults = (logisticsSetting?.value as Record<string, unknown>)?.comboDefaults as {
    weight?: number; weightUnit?: string; length?: number; width?: number; height?: number
  } | undefined

  // Parse default importer metadata
  const importerMeta = defaultImporter?.metadata as Record<string, unknown> | undefined

  // Also check for ANY products (including deleted) with matching business IDs
  // to avoid P2002 on `id` unique constraint
  const allCustomIds = products.map(p => p.id).filter(Boolean) as string[]
  let takenIds = new Set<string>()
  if (allCustomIds.length > 0) {
    const productsWithMatchingIds = await prisma.product.findMany({
      where: { id: { in: allCustomIds } },
      select: { id: true },
    })
    takenIds = new Set(productsWithMatchingIds.map(p => p.id))
  }

  // Build lookup maps
  const existingByPkgxId = new Map(existingProducts.filter(p => p.pkgxId).map(p => [p.pkgxId!, p]))
  const existingById = new Map(existingProducts.map(p => [p.id, p]))

  const employeeId = (session!.user as { employeeId?: string })?.employeeId || null
  let employeeName = 'Hệ thống'
  if (employeeId) {
    const emp = await prisma.employee.findUnique({
      where: { systemId: employeeId },
      select: { fullName: true },
    })
    if (emp?.fullName) employeeName = emp.fullName
  }

  const results: { pkgxId: number; success: boolean; error?: string; systemId?: string }[] = []

  // Track business IDs used in this batch to avoid duplicates within batch
  const usedBusinessIds = new Set([...existingProducts.map(p => p.id), ...takenIds])

  // Process sequentially to avoid systemId race condition in generateNextIdsWithTx
  for (const item of products) {
    try {
      // Check existing
      let existing = existingByPkgxId.get(item.pkgxId)
      if (!existing && item.id) {
        const byId = existingById.get(item.id)
        if (byId && (!byId.pkgxId || byId.pkgxId === item.pkgxId)) {
          existing = byId
        }
      }

      const brandIdToUse = item.brandId
      const categoryIdsToUse = item.categoryIds || []

      // Select logistics defaults based on product type
      const isCombo = (item.type || 'PHYSICAL') === 'COMBO'
      const preset = isCombo ? comboDefaults : logisticsDefaults

      const productData: Record<string, unknown> = {
        id: item.id,
        name: item.name,
        description: item.description,
        shortDescription: item.shortDescription,
        thumbnailImage: item.thumbnailImage || item.imageUrl,
        imageUrl: item.thumbnailImage || item.imageUrl,
        galleryImages: item.galleryImages || [],
        type: (item.type || 'PHYSICAL') as ProductType,
        ...(brandIdToUse ? { brand: { connect: { systemId: brandIdToUse } } } : {}),
        categorySystemIds: categoryIdsToUse,
        unit: item.unit || 'Cái',
        costPrice: item.costPrice || 0,
        lastPurchasePrice: item.lastPurchasePrice ?? 0,
        lastPurchaseDate: item.lastPurchaseDate ? new Date(item.lastPurchaseDate) : new Date(),
        reorderLevel: item.reorderLevel || 0,
        // Apply logistics defaults from settings
        weight: item.weight ?? preset?.weight ?? undefined,
        weightUnit: item.weightUnit || (preset?.weightUnit === 'kg' ? 'KILOGRAM' : 'GRAM'),
        dimensions: preset ? { length: preset.length || 0, width: preset.width || 0, height: preset.height || 0 } : undefined,
        isPublished: item.isPublished ?? false,
        isFeatured: item.isFeatured ?? false,
        isNewArrival: item.isNewArrival ?? false,
        isBestSeller: item.isBestSeller ?? false,
        isOnSale: item.isOnSale ?? false,
        ktitle: item.seoTitle || item.ktitle,
        seoDescription: item.seoDescription,
        seoKeywords: item.seoKeywords,
        sellerNote: item.sellerNote,
        productTypeSystemId: productTypeSystemId || undefined,
        launchedDate: item.launchedDate ? new Date(item.launchedDate) : undefined,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
        status: 'ACTIVE' as ProductStatus,
        createdBy: employeeId,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        pkgxId: item.pkgxId,
        seoPkgx: item.seoPkgx || undefined,
        // Apply default importer from settings
        ...(defaultImporter ? {
          importerSystemId: defaultImporter.systemId,
          importerName: defaultImporter.name,
          importerAddress: (importerMeta?.address as string) || undefined,
        } : {}),
      }

      let product: { systemId: string; id: string; name: string }
      let isUpdate = false

      if (existing) {
        isUpdate = true
        product = await prisma.product.update({
          where: { systemId: existing.systemId },
          data: productData as Prisma.ProductUpdateInput,
          select: { systemId: true, id: true, name: true },
        })
      } else {
        try {
          product = await prisma.$transaction(async (tx) => {
            // Only use item.id as custom businessId if it's not already taken
            const customId = (item.id || '').trim() || undefined
            const safeCustomId = customId && !usedBusinessIds.has(customId) ? customId : undefined
            
            const { systemId, businessId } = await generateNextIdsWithTx(
              tx, 'products', safeCustomId
            )
            
            // Track this businessId to prevent duplicates within batch
            usedBusinessIds.add(businessId)
            
            return tx.product.create({
              data: {
                systemId,
                ...productData,
                id: businessId,
              } as unknown as Prisma.ProductCreateInput,
              select: { systemId: true, id: true, name: true },
            })
          })
        } catch (createError) {
          // P2002 on `id` field - retry with unique timestamp suffix
          if (createError instanceof Prisma.PrismaClientKnownRequestError && createError.code === 'P2002') {
            product = await prisma.$transaction(async (tx) => {
              const { systemId, businessId } = await generateNextIdsWithTx(tx, 'products')
              // Append random suffix to ensure uniqueness
              const uniqueId = `${businessId}-${Date.now().toString(36)}`
              usedBusinessIds.add(uniqueId)
              return tx.product.create({
                data: {
                  systemId,
                  ...productData,
                  id: uniqueId,
                } as unknown as Prisma.ProductCreateInput,
                select: { systemId: true, id: true, name: true },
              })
            })
          } else {
            throw createError
          }
        }
      }

      // Categories
      if (isUpdate) {
        await prisma.productCategory.deleteMany({ where: { productId: product.systemId } })
      }
      if (categoryIdsToUse.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryIdsToUse.map((cid: string) => ({
            productId: product.systemId,
            categoryId: cid,
          })),
          skipDuplicates: true,
        })
      }

      // PKGX Price mappings
      if (item.pkgxPrices && priceMappings.length > 0) {
        if (isUpdate) {
          await prisma.productPrice.deleteMany({ where: { productId: product.systemId } })
        }
        const priceData = priceMappings
          .filter(m => m.pricingPolicyId && item.pkgxPrices![m.priceType as keyof typeof item.pkgxPrices] !== undefined)
          .map(m => ({
            productId: product.systemId,
            pricingPolicyId: m.pricingPolicyId!,
            price: Number(item.pkgxPrices![m.priceType as keyof typeof item.pkgxPrices]) || 0,
          }))
        if (priceData.length > 0) {
          await prisma.productPrice.createMany({ data: priceData, skipDuplicates: true })
        }
      }

      // Ensure inventory + stock history exists for ALL products (new & updated)
      if (allBranches.length > 0) {
        // Always upsert inventory (skipDuplicates handles existing)
        await prisma.productInventory.createMany({
          data: allBranches.map(b => ({
            productId: product.systemId,
            branchId: b.systemId,
            onHand: 0,
            committed: 0,
            inTransit: 0,
          })),
          skipDuplicates: true,
        })

        // Check if "Khởi tạo sản phẩm" record already exists
        const existingInit = await prisma.stockHistory.findFirst({
          where: {
            productId: product.systemId,
            action: 'Khởi tạo sản phẩm',
          },
          select: { systemId: true },
        })

        // Thời gian khởi tạo lấy từ PKGX (createdAt của sản phẩm gốc)
        const pkgxCreatedAt = item.createdAt ? new Date(item.createdAt) : new Date()

        if (!existingInit) {
          await prisma.stockHistory.createMany({
            data: allBranches.map(b => ({
              productId: product.systemId,
              branchId: b.systemId,
              action: 'Khởi tạo sản phẩm',
              source: 'Import & Mapping từ PKGX',
              quantityChange: 0,
              newStockLevel: 0,
              documentId: product.id,
              documentType: 'pkgx_import',
              employeeId,
              employeeName,
              note: `Import từ PKGX ID: ${item.pkgxId}`,
              createdAt: pkgxCreatedAt,
            })),
            skipDuplicates: true,
          })
        }
      }

      results.push({ pkgxId: item.pkgxId, success: true, systemId: product.systemId })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Duplicate on non-id field (e.g. pkgxId) - try to find existing
        const existingByPkgx = await prisma.product.findFirst({
          where: { pkgxId: item.pkgxId, isDeleted: false },
          select: { systemId: true },
        })
        if (existingByPkgx) {
          results.push({ pkgxId: item.pkgxId, success: true, systemId: existingByPkgx.systemId })
          continue
        }
      }
      const msg = error instanceof Error ? error.message : String(error)
      logError(`[Bulk Import] Failed: ${item.name}`, error)
      results.push({ pkgxId: item.pkgxId, success: false, error: msg })
    }
  }

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length

  return apiSuccess({
    total: products.length,
    success: successCount,
    errors: errorCount,
    results,
  })
}, { permission: 'create_products', rateLimit: { max: 100, windowMs: 60_000 } })
