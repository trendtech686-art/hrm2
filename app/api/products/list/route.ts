import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * Optimized Products List API
 * - Uses real server-side pagination
 * - Minimal field selection (no heavy includes unless needed)
 * - Database-level filtering and sorting
 */

// Select only essential fields for list view
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
  createdAt: true,
  pkgxId: true,
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
  // Basic flags
  isPublished: true,
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: true,
  reorderLevel: true,
  safetyStock: true,
  maxStock: true,
  sellerNote: true,
  warrantyPeriodMonths: true,
  // Include brand name to avoid separate lookup
  brand: {
    select: {
      systemId: true,
      name: true,
    },
  },
} as const

// GET /api/products/list - Optimized list endpoint
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
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

    // Stock filter - now uses computed columns for database-level filtering
    if (stockFilter && stockFilter !== 'all') {
      switch (stockFilter) {
        case 'out-of-stock':
          where.totalInventory = { lte: 0 }
          break
        case 'low-stock':
          // totalInventory > 0 AND totalInventory <= reorderLevel
          where.AND = [
            { totalInventory: { gt: 0 } },
            { reorderLevel: { not: null } },
            // Using raw query for comparison between columns
          ]
          // For now, we'll still need post-filter for comparing with reorderLevel
          break
        case 'below-safety':
          where.AND = [
            { safetyStock: { not: null } },
          ]
          break
        case 'in-stock':
          where.totalInventory = { gt: 0 }
          break
        case 'high-stock':
          where.AND = [
            { maxStock: { not: null } },
          ]
          break
      }
    }

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
      // Now using computed totalInventory column - only need post-filter for comparing columns
      filteredProducts = products.filter(product => {
        const totalInventory = product.totalInventory ?? 0
        
        switch (stockFilter) {
          case 'out-of-stock':
            // Already filtered at database level, but double-check
            return totalInventory <= 0
          case 'low-stock':
            return totalInventory > 0 && product.reorderLevel != null && totalInventory <= product.reorderLevel
          case 'below-safety':
            return product.safetyStock != null && totalInventory < product.safetyStock
          case 'in-stock':
            return totalInventory > 0
          case 'high-stock':
            return product.maxStock != null && totalInventory > product.maxStock
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
      
      // Remove productInventory from response to keep it clean
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { productInventory, ...rest } = product;
      
      return {
        ...rest,
        costPrice: product.costPrice ? Number(product.costPrice) : 0,
        // Denormalize brand name for fast display
        brandName: product.brand?.name ?? null,
        // Transform productInventory to inventoryByBranch
        inventoryByBranch,
        committedByBranch,
        inTransitByBranch,
        inDeliveryByBranch,
        // Prices will be fetched separately when needed
        prices: {}, // Empty for list view - load on detail
      };
    })

    return NextResponse.json({
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: stockFilter && stockFilter !== 'all' ? adjustedTotal : total,
        totalPages: Math.ceil((stockFilter && stockFilter !== 'all' ? adjustedTotal : total) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products list:', error)
    return apiError('Failed to fetch products', 500)
  }
}
