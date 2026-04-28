import { prisma } from '@/lib/prisma'
import { Prisma, ProductStatus, ProductType } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createProductSchema } from './validation'
import { transformProduct } from './transform'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import { syncSingleProduct } from '@/lib/meilisearch-sync'
import { buildProductSearchWhere } from '@/lib/search/product-search-where'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

// GET /api/products - List all products
export const GET = apiHandler(async (request) => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const systemIds = searchParams.get('systemIds') // comma-separated systemIds for batch lookup

    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
    }

    // Batch lookup by systemIds (skip other filters when used)
    // ✅ FIX: Also lookup by id (SKU) to handle legacy data where productSystemId contains SKU
    if (systemIds) {
      const ids = systemIds.split(',').filter(Boolean)
      if (ids.length > 0) {
        where.OR = [
          { systemId: { in: ids } },
          { id: { in: ids } }, // Also match by SKU/business ID
        ]
      }
    }

    const searchWhere = buildProductSearchWhere(search)
    if (searchWhere) {
      Object.assign(where, searchWhere)
    }

    if (status) {
      where.status = status as Prisma.EnumProductStatusFilter<"Product">
    }

    if (brandId) {
      where.brandId = brandId
    }

    if (categoryId) {
      where.categorySystemIds = {
        has: categoryId,
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          systemId: true,
          id: true,
          name: true,
          slug: true,
          thumbnailImage: true,
          imageUrl: true,
          type: true,
          status: true,
          costPrice: true,
          lastPurchasePrice: true,
          lastPurchaseDate: true,
          weight: true,
          weightUnit: true,
          barcode: true,
          unit: true,
          warrantyPeriodMonths: true,
          isPublished: true,
          isFeatured: true,
          isNewArrival: true,
          isBestSeller: true,
          isOnSale: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          brand: {
            select: { systemId: true, name: true },
          },
          productInventory: {
            select: {
              branchId: true,
              onHand: true,
              committed: true,
              inTransit: true,
              inDelivery: true,
            },
          },
          prices: {
            select: {
              pricingPolicyId: true,
              price: true,
            },
          },
          productCategories: {
            select: {
              categoryId: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    // Transform to frontend-compatible format
    const transformedProducts = products.map(transformProduct);

    // Batch resolve employee names for createdBy/updatedBy
    const employeeIds = [...new Set(
      products.flatMap(p => [p.createdBy, p.updatedBy]).filter(Boolean) as string[]
    )]
    const employees = employeeIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: employeeIds } },
          select: { systemId: true, fullName: true },
        })
      : []
    const empMap = new Map(employees.map(e => [e.systemId, e.fullName]))
    const withNames = transformedProducts.map((p: Record<string, unknown>) => ({
      ...p,
      createdByName: empMap.get(p.createdBy as string) || null,
      updatedByName: empMap.get(p.updatedBy as string) || null,
    }))

    return apiPaginated(withNames, { page, limit, total })
})

// POST /api/products - Create new product
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createProductSchema)
  if (!result.success) return apiError(result.error, 400)

  const body = result.data

  try {

    // Generate business ID: prefer provided id, fallback to auto-gen
    // id = SKU = goods_sn (PKGX) - single source of truth
    if (!body.id) {
      const lastProduct = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastProduct?.id 
        ? parseInt(lastProduct.id.replace('SP', '')) 
        : 0
      body.id = `SP${String(lastNum + 1).padStart(5, '0')}`
    }

    // Get default product type if not provided
    let productTypeSystemId = body.productTypeSystemId;
    if (!productTypeSystemId) {
      const defaultProductType = await prisma.settingsData.findFirst({
        where: { type: 'product-type', isActive: true, isDeleted: false, isDefault: true },
      });
      if (!defaultProductType) {
        const fallbackProductType = await prisma.settingsData.findFirst({
          where: { type: 'product-type', isActive: true, isDeleted: false },
          orderBy: { name: 'asc' },
        });
        productTypeSystemId = fallbackProductType?.systemId;
      } else {
        productTypeSystemId = defaultProductType.systemId;
      }
    }

    // Check if product already exists by pkgxId, id, or slug (for upsert)
    let existingProduct: { systemId: string; pkgxId: number | null } | null = null;
    let _matchedBy = '';
    if (body.pkgxId) {
      existingProduct = await prisma.product.findFirst({
        where: { pkgxId: body.pkgxId, isDeleted: false },
        select: { systemId: true, pkgxId: true },
      });
      if (existingProduct) _matchedBy = 'pkgxId';
    }
    if (!existingProduct && body.id) {
      const productById = await prisma.product.findFirst({
        where: { id: body.id, isDeleted: false },
        select: { systemId: true, pkgxId: true },
      });
      // Only match by id if the existing product doesn't have a different pkgxId
      // If it has a different pkgxId, we need to create a new product with a different id
      if (productById) {
        if (!productById.pkgxId || productById.pkgxId === body.pkgxId) {
          existingProduct = productById;
          _matchedBy = 'id';
        } else {
          // Product exists with same id but different pkgxId - generate new id
          const lastProduct = await prisma.product.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { id: true },
          });
          const lastNum = lastProduct?.id 
            ? parseInt(lastProduct.id.replace(/\D/g, '')) || 10000
            : 0;
          body.id = `SP${String(lastNum + 1).padStart(5, '0')}`;
        }
      }
    }
    if (!existingProduct && body.slug) {
      existingProduct = await prisma.product.findFirst({
        where: { slug: body.slug, isDeleted: false },
        select: { systemId: true, pkgxId: true },
      });
      // matchedBy would be 'slug' here but it's unused
    }

    // Support both brandId and brandSystemId (frontend uses brandSystemId)
    const brandIdToUse = body.brandId || body.brandSystemId;
    // Support both categoryIds and categorySystemIds (frontend uses categorySystemIds)
    const categoryIdsToUse = body.categoryIds || body.categorySystemIds || [];

    const productData = {
      id: body.id,
      name: body.name,
      description: body.description,
      shortDescription: body.shortDescription,
      thumbnailImage: body.thumbnailImage || body.imageUrl,
      imageUrl: body.thumbnailImage || body.imageUrl,
      galleryImages: body.galleryImages || body.images || [],
      type: (body.type || 'PHYSICAL') as ProductType,
      // Use relation syntax for brand instead of brandId
      ...(brandIdToUse ? { brand: { connect: { systemId: brandIdToUse } } } : {}),
      categorySystemIds: categoryIdsToUse,
      unit: body.unit || 'Cái',
      costPrice: body.costPrice || 0,
      // lastPurchasePrice và lastPurchaseDate cho PKGX import
      lastPurchasePrice: body.lastPurchasePrice ?? body.costPrice ?? 0,
      lastPurchaseDate: body.lastPurchaseDate ? new Date(body.lastPurchaseDate) : new Date(),
      // sellingPrice and minPrice are stored in ProductPrice table, not Product
      // inventoryByBranch for initial stock levels
      inventoryByBranch: body.inventoryByBranch || {},
      reorderLevel: body.reorderLevel || 0,
      safetyStock: body.safetyStock,
      maxStock: body.maxStock,
      weight: body.weight,
      weightUnit: body.weightUnit || 'GRAM',
      barcode: body.barcode,
      warrantyPeriodMonths: body.warrantyPeriodMonths ?? 12,
      primarySupplierId: body.primarySupplierId,
      isPublished: body.isPublished ?? false,
      isFeatured: body.isFeatured ?? false,
      isNewArrival: body.isNewArrival ?? false,
      isBestSeller: body.isBestSeller ?? false,
      isOnSale: body.isOnSale ?? false,
      // seoTitle doesn't exist in schema, use ktitle instead
      ktitle: body.seoTitle || body.ktitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      slug: body.slug,
      sellerNote: body.sellerNote,
      productTypeSystemId: productTypeSystemId || undefined,
      launchedDate: body.launchedDate ? new Date(body.launchedDate) : undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      status: (body.status || 'ACTIVE') as ProductStatus,
      // Set createdBy from body or session employee
      createdBy: body.createdBy || (session!.user as { employeeId?: string })?.employeeId || null,
      pkgxId: body.pkgxId,
      // Tem phụ fields
      nameVat: body.nameVat,
      origin: body.origin,
      usageGuide: body.usageGuide,
      importerName: body.importerName,
      importerAddress: body.importerAddress,
      importerSystemId: body.importerSystemId,
      // SEO fields
      seoPkgx: body.seoPkgx || undefined,
      seoTrendtech: body.seoTrendtech || undefined,
      // pkgxName doesn't exist in schema - stored in seoPkgx if needed
    };

    let product;
    let isUpdate = false;

    if (existingProduct) {
      // Update existing product
      isUpdate = true;
      product = await prisma.product.update({
        where: { systemId: existingProduct.systemId },
        data: productData,
        select: {
          systemId: true,
          id: true,
          name: true,
          slug: true,
          thumbnailImage: true,
          imageUrl: true,
          status: true,
          brand: { select: { systemId: true, name: true } },
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Create new product with unified ID system
      product = await prisma.$transaction(async (tx) => {
        const { systemId, businessId } = await generateNextIdsWithTx(
          tx,
          'products',
          productData.id?.trim() || undefined
        );
        
        return tx.product.create({
          data: {
            systemId,
            ...productData,
            id: businessId,
          },
          select: {
            systemId: true,
            id: true,
            name: true,
            slug: true,
            thumbnailImage: true,
            imageUrl: true,
            status: true,
            brand: { select: { systemId: true, name: true } },
            createdAt: true,
            updatedAt: true,
          },
        });
      });
    }

    // For updates, delete existing categories first
    if (isUpdate) {
      await prisma.productCategory.deleteMany({
        where: { productId: product.systemId },
      });
    }

    // Add categories if provided
    if (categoryIdsToUse && categoryIdsToUse.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryIdsToUse.map((categoryId: string) => ({
          productId: product.systemId,
          categoryId,
        })),
      })
    }

    // ✅ Create ProductPrice records from form prices (Record<policySystemId, number>)
    if (body.prices && typeof body.prices === 'object' && !Array.isArray(body.prices)) {
      // For updates, delete existing prices first
      if (isUpdate) {
        await prisma.productPrice.deleteMany({
          where: { productId: product.systemId },
        });
      }

      // Create ProductPrice for each policy
      for (const [policySystemId, priceValue] of Object.entries(body.prices)) {
        if (priceValue !== undefined && priceValue !== null && Number(priceValue) >= 0) {
          // Verify that the PricingPolicy exists before creating ProductPrice
          const policyExists = await prisma.pricingPolicy.findUnique({
            where: { systemId: policySystemId },
            select: { systemId: true },
          });
          
          if (policyExists) {
            await prisma.productPrice.upsert({
              where: {
                productId_pricingPolicyId: {
                  productId: product.systemId,
                  pricingPolicyId: policySystemId,
                },
              },
              create: {
                productId: product.systemId,
                pricingPolicyId: policySystemId,
                price: Number(priceValue),
              },
              update: {
                price: Number(priceValue),
              },
            });
          } else {
            logInfo(`[Products API] Skipping price: PricingPolicy ${policySystemId} not found`)
          }
        }
      }
    }

    // Create ProductPrice records from PKGX prices if provided
    if (body.pkgxPrices) {
      // For updates, delete existing prices first (only if not already handled above)
      if (isUpdate && !body.prices) {
        await prisma.productPrice.deleteMany({
          where: { productId: product.systemId },
        });
      }

      // Get PKGX price mappings
      const priceMappings = await prisma.pkgxPriceMapping.findMany({
        where: { isActive: true },
      });
      
      // Create ProductPrice for each mapped price type
      for (const mapping of priceMappings) {
        const priceValue = body.pkgxPrices[mapping.priceType as keyof typeof body.pkgxPrices];
        if (priceValue !== undefined && priceValue !== null && mapping.pricingPolicyId) {
          // Verify that the PricingPolicy exists before creating ProductPrice
          const policyExists = await prisma.pricingPolicy.findUnique({
            where: { systemId: mapping.pricingPolicyId },
            select: { systemId: true },
          });
          
          if (policyExists) {
            await prisma.productPrice.create({
              data: {
                productId: product.systemId,
                pricingPolicyId: mapping.pricingPolicyId,
                price: Number(priceValue),
              },
            });
          } else {
            logInfo(`[Products API] Skipping price mapping: PricingPolicy ${mapping.pricingPolicyId} not found`)
          }
        }
      }
    }

    // Khi tạo sản phẩm MỚI (không phải update): Khởi tạo tồn kho cho TẤT CẢ chi nhánh
    // và tạo lịch sử kho "Khởi tạo sản phẩm"
    if (!isUpdate) {
      // Lấy tất cả chi nhánh
      const allBranches = await prisma.branch.findMany({
        where: { isDeleted: false },
        select: { systemId: true, name: true, isDefault: true },
      });
      
      // Get initial inventory from request body (form values)
      const initialInventory = body.inventoryByBranch || {};
      
      // Get employee info for stock history
      // session.user.employeeId is the employee.systemId
      // session.user.id is the user.systemId (not employee!)
      
      // Try multiple sources for employee info
      const sessionUser = session!.user as { 
        employeeId?: string; 
        employee?: { systemId?: string; fullName?: string } 
      };
      
      // Get employeeSystemId from: body.createdBy > session.employee.systemId > session.employeeId
      const employeeSystemId = body.createdBy 
        || sessionUser?.employee?.systemId 
        || sessionUser?.employeeId 
        || null;
      
      // Get employee name: try session.employee.fullName first, then lookup from DB
      let employeeName = sessionUser?.employee?.fullName || 'Hệ thống';
      
      // If we have employeeSystemId but no name yet, lookup from database
      if (employeeSystemId && employeeName === 'Hệ thống') {
        const employee = await prisma.employee.findUnique({
          where: { systemId: employeeSystemId },
          select: { fullName: true },
        });
        if (employee?.fullName) {
          employeeName = employee.fullName;
        }
      }

      // Tạo ProductInventory cho tất cả chi nhánh với số lượng từ form
      if (allBranches.length > 0) {
        await prisma.productInventory.createMany({
          data: allBranches.map(branch => {
            const qty = Number(initialInventory[branch.systemId]) || 0;
            return {
              productId: product.systemId,
              branchId: branch.systemId,
              onHand: qty,
              committed: 0,
              inTransit: 0,
            };
          }),
          skipDuplicates: true,
        });
        
        // Tạo StockHistory entry cho TẤT CẢ chi nhánh
        const source = body.pkgxId ? 'Import & Mapping từ PKGX' : 'Tạo mới sản phẩm';
        const documentType = body.pkgxId ? 'pkgx_import' : 'product_create';
        const note = body.pkgxId 
          ? `Import từ PKGX ID: ${body.pkgxId}. Giá nhập khởi tạo: 0 (chưa có giá từ PKGX)`
          : 'Tạo mới sản phẩm từ HRM';
        
        // Check if stock history already exists for this product (prevent duplicates from race conditions)
        const existingStockHistory = await prisma.stockHistory.findFirst({
          where: {
            productId: product.systemId,
            action: 'Khởi tạo sản phẩm',
          },
        });
        
        // Chỉ tạo stock history nếu chưa có (tránh duplicate từ race condition)
        if (!existingStockHistory) {
          // Tạo stock history cho tất cả chi nhánh (để hiển thị rõ ràng lịch sử khởi tạo)
          await prisma.stockHistory.createMany({
            data: allBranches.map(branch => {
              const qty = Number(initialInventory[branch.systemId]) || 0;
              return {
                productId: product.systemId,
                branchId: branch.systemId,
                action: 'Khởi tạo sản phẩm',
                source: source,
                quantityChange: qty,
                newStockLevel: qty,
                documentId: product.id,
                documentType: documentType,
                employeeId: employeeSystemId,
                employeeName: employeeName,
                note: note,
              };
            }),
          });
        }
      }
    }

    // Fire-and-forget activity log
    prisma.activityLog.create({
      data: {
        entityType: 'product',
        entityId: product.systemId,
        action: isUpdate ? 'updated' : 'created',
        actionType: isUpdate ? 'update' : 'create',
        note: isUpdate
          ? `Cập nhật sản phẩm: ${product.name} (${product.id})`
          : `Tạo sản phẩm: ${product.name} (${product.id})`,
        metadata: {
          productId: product.id,
          productName: product.name,
          isUpdate,
        },
        createdBy: getSessionUserName(session),
      },
    }).catch(e => logError('Activity log failed', e))

    // Fire-and-forget: sync to Meilisearch
    syncSingleProduct(product.systemId).catch(e => logError('[Meilisearch] Product sync failed', e))

    return apiSuccess(product, isUpdate ? 200 : 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Race condition: product was created by another request between check and create
      // Try to find and return the existing product instead of failing
      
      // Try to find the product that was just created
      type ProductWithBrand = Awaited<ReturnType<typeof prisma.product.findFirst<{ select: { systemId: true; id: true; name: true; slug: true; thumbnailImage: true; imageUrl: true; status: true; brand: { select: { systemId: true; name: true } }; createdAt: true; updatedAt: true } }>>>;
      let existingProd: ProductWithBrand = null;
      if (body.pkgxId) {
        existingProd = await prisma.product.findFirst({
          where: { pkgxId: body.pkgxId },
          select: { systemId: true, id: true, name: true, slug: true, thumbnailImage: true, imageUrl: true, status: true, brand: { select: { systemId: true, name: true } }, createdAt: true, updatedAt: true },
        });
      }
      if (!existingProd && body.id) {
        existingProd = await prisma.product.findFirst({
          where: { id: body.id },
          select: { systemId: true, id: true, name: true, slug: true, thumbnailImage: true, imageUrl: true, status: true, brand: { select: { systemId: true, name: true } }, createdAt: true, updatedAt: true },
        });
      }
      
      if (existingProd) {
        return apiSuccess(existingProd, 200);
      }
      
      return apiError('Mã sản phẩm hoặc slug đã tồn tại', 400)
    }

    throw error
  }
}, { permission: 'create_products', rateLimit: { max: 30, windowMs: 60_000 } })
