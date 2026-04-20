import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { NextResponse } from 'next/server'

/**
 * Optimized Products List API
 * - Uses real server-side pagination
 * - Minimal field selection (no heavy includes unless needed)
 * - Database-level filtering and sorting
 */

// Select fields needed for list view columns
const PRODUCT_LIST_SELECT = {
  systemId: true,
  id: true,
  name: true,
  thumbnailImage: true,
  type: true,
  brandId: true,
  categorySystemIds: true,
  unit: true,
  costPrice: true,
  barcode: true,
  status: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  pkgxId: true,
  pkgxSyncedAt: true,
  trendtechId: true,
  // Include productInventory to build inventoryByBranch (the JSON cache field may be stale)
  productInventory: {
    select: {
      branchId: true,
      onHand: true,
      committed: true,
      inTransit: true,
      inDelivery: true,
    }
  },
  // Computed inventory totals for fast filtering
  totalInventory: true,
  totalCommitted: true,
  totalAvailable: true,
  // Pricing & purchasing
  lastPurchasePrice: true,
  lastPurchaseDate: true,
  primarySupplierId: true,
  // Basic flags
  isPublished: true,
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: true,
  isOnSale: true,
  isStockTracked: true,
  sortOrder: true,
  publishedAt: true,
  reorderLevel: true,
  safetyStock: true,
  maxStock: true,
  sellerNote: true,
  warrantyPeriodMonths: true,
  // Sales & analytics
  totalSold: true,
  viewCount: true,
  // Tags & classification
  tags: true,
  // SEO fields
  ktitle: true,
  seoDescription: true,
  seoKeywords: true,
  seoPkgx: true,
  seoTrendtech: true,
  shortDescription: true,
  description: true,
  // Tem phụ fields
  nameVat: true,
  origin: true,
  usageGuide: true,
  importerSystemId: true,
  importerName: true,
  importerAddress: true,
  // Logistics
  weight: true,
  weightUnit: true,
  dimensions: true,
  warehouseLocation: true,
  // E-commerce media
  galleryImages: true,
  videoLinks: true,
  // Variants & combos
  hasVariants: true,
  variants: true,
  comboItems: true,
  // Lifecycle
  discontinuedDate: true,
  // Include brand name to avoid separate lookup
  brand: {
    select: {
      systemId: true,
      name: true,
    },
  },
  // Include prices for price columns
  prices: {
    select: {
      pricingPolicyId: true,
      price: true,
    },
  },
} as const

// GET /api/products/list - Optimized list endpoint
export const GET = apiHandler(async (request, _ctx) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100) // Max 100 per page
    const skip = (page - 1) * limit
    
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const pkgxFilter = searchParams.get('pkgxFilter') // 'linked' | 'not-linked'
    const stockFilter = searchParams.get('stockFilter') // 'out-of-stock' | 'low-stock' etc
    const comboFilter = searchParams.get('comboFilter') // 'combo' | 'non-combo'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    // Build WHERE clause
    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
    }

    // Text search (optimized with OR on indexed fields)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search } },
      ]
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status as Prisma.EnumProductStatusFilter<"Product">
    }

    // Type filter
    if (type && type !== 'all') {
      where.type = type as Prisma.EnumProductTypeFilter<"Product">
    }

    // Combo filter (overrides type filter if set)
    if (comboFilter === 'combo') {
      where.type = 'COMBO'
    } else if (comboFilter === 'non-combo') {
      where.type = { not: 'COMBO' }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        where.createdAt.lte = to
      }
    }

    // Brand filter
    if (brandId && brandId !== 'all') {
      where.brandId = brandId
    }

    // Category filter
    if (categoryId && categoryId !== 'all') {
      where.categorySystemIds = { has: categoryId }
    }

    // PKGX filter
    if (pkgxFilter === 'linked') {
      where.pkgxId = { not: null }
    } else if (pkgxFilter === 'not-linked') {
      where.pkgxId = null
    }

    // Stock filter - applied via post-filter using productInventory relation (source of truth)
    // Database-level pre-filter is intentionally skipped because product.totalInventory
    // may be stale. The real filtering happens in the post-filter section below.

    // Build ORDER BY
    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sortBy) {
      case 'name':
        orderBy.name = sortOrder
        break
      case 'id':
        orderBy.id = sortOrder
        break
      case 'status':
        orderBy.status = sortOrder
        break
      case 'createdAt':
      default:
        orderBy.createdAt = sortOrder
        break
    }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: PRODUCT_LIST_SELECT,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    // Post-process for stock filter (needs JSON field parsing)
    // Note: For large datasets (10k+), consider adding a computed column or scheduled job
    // to pre-calculate total inventory for better performance
    let filteredProducts = products
    let adjustedTotal = total
    
    if (stockFilter && stockFilter !== 'all') {
      // Compute real inventory from productInventory relation (source of truth)
      filteredProducts = products.filter(product => {
        const realInventory = Array.isArray(product.productInventory)
          ? product.productInventory.reduce((sum, inv) => sum + Number(inv.onHand || 0), 0)
          : (product.totalInventory ?? 0)
        
        switch (stockFilter) {
          case 'out-of-stock':
            return realInventory <= 0
          case 'low-stock':
            return realInventory > 0 && product.reorderLevel != null && realInventory <= product.reorderLevel
          case 'below-safety':
            return product.safetyStock != null && realInventory < product.safetyStock
          case 'in-stock':
            return realInventory > 0
          case 'high-stock':
            return product.maxStock != null && realInventory > product.maxStock
          default:
            return true
        }
      })
      
      // Adjust total for stock filter
      adjustedTotal = filteredProducts.length
    }

    // Transform to match frontend expectations
    const transformedProducts = filteredProducts.map(product => {
      // Build inventoryByBranch from productInventory relation
      const inventoryByBranch: Record<string, number> = {};
      const committedByBranch: Record<string, number> = {};
      const inTransitByBranch: Record<string, number> = {};
      const inDeliveryByBranch: Record<string, number> = {};
      
      if (Array.isArray(product.productInventory)) {
        for (const inv of product.productInventory) {
          const branchId = inv.branchId;
          if (branchId) {
            inventoryByBranch[branchId] = Number(inv.onHand || 0);
            committedByBranch[branchId] = Number(inv.committed || 0);
            inTransitByBranch[branchId] = Number(inv.inTransit || 0);
            inDeliveryByBranch[branchId] = Number(inv.inDelivery || 0);
          }
        }
      }
      
      // Remove productInventory and raw prices from response to keep it clean
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { productInventory, prices: pricesArray, brandId, primarySupplierId, ...rest } = product;

      // Transform prices array to Record<policyId, number>
      const prices: Record<string, number> = {};
      if (Array.isArray(pricesArray)) {
        for (const pp of pricesArray) {
          prices[pp.pricingPolicyId] = Number(pp.price);
        }
      }
      
      return {
        ...rest,
        costPrice: product.costPrice ? Number(product.costPrice) : 0,
        lastPurchasePrice: product.lastPurchasePrice ? Number(product.lastPurchasePrice) : 0,
        // Map Prisma field names to frontend Product type names
        brandSystemId: brandId ?? null,
        primarySupplierSystemId: primarySupplierId ?? null,
        // Denormalize brand name for fast display
        brandName: product.brand?.name ?? null,
        // Derive singular categorySystemId for column display
        categorySystemId: (product.categorySystemIds as string[])?.[0] || null,
        // Transform productInventory to inventoryByBranch
        inventoryByBranch,
        committedByBranch,
        inTransitByBranch,
        inDeliveryByBranch,
        prices,
      };
    })

    const finalTotal = stockFilter && stockFilter !== 'all' ? adjustedTotal : total
    return NextResponse.json({
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limit),
      },
    })
})
