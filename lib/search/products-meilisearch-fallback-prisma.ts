/**
 * Prisma fallback search when Meilisearch is unavailable or returns 0 hits.
 *
 * Provides tokenized AND-substring search using the same pattern as
 * buildSearchWhere (multi-token AND, each token matches any of the specified fields).
 */

import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaFallbackHit {
  systemId: string
  id: string
  name: string
  barcode: string | null
  brandId: string | null
  brandName: string | null
  categoryId: string | null
  categoryName: string | null
  costPrice: number
  lastPurchasePrice: number
  price: number
  prices: Record<string, number>
  unit: string
  status: string
  thumbnailImage: string | null
  pkgxId: number | null
  totalStock: number
  branchStocks: Array<{ branchId: string; branchName: string; onHand: number }>
}

export async function prismaProductSearchAsMeiliHits({
  query,
  limit,
  offset,
  brandId,
  categoryId,
  status,
}: {
  query: string
  limit: number
  offset: number
  brandId?: string | null
  categoryId?: string | null
  status?: string | null
}): Promise<{ hits: PrismaFallbackHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = {
    isDeleted: false,
  }

  const searchWhere = buildSearchWhere(query, ['name', 'id', 'barcode'])
  if (searchWhere) {
    Object.assign(where, searchWhere)
  }

  if (brandId) {
    where.brandId = brandId
  }

  if (categoryId) {
    where.categories = { has: categoryId }
  }

  if (status) {
    where.status = status
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        brand: { select: { name: true } },
        prices: { select: { pricingPolicyId: true, price: true } },
        productInventory: {
          select: {
            branchId: true,
            onHand: true,
            branch: { select: { systemId: true, name: true } },
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  const hits: PrismaFallbackHit[] = products.map((p) => {
    // Build prices object
    const prices: Record<string, number> = {}
    for (const pp of p.prices) {
      prices[pp.pricingPolicyId] = Number(pp.price) || 0
    }

    // Build branchStocks
    const branchStocks = p.productInventory
      .filter((inv) => inv.branchId)
      .map((inv) => ({
        branchId: inv.branch.systemId,
        branchName: inv.branch.name,
        onHand: inv.onHand || 0,
      }))

    // Calculate total stock
    const totalStock = p.productInventory.reduce((sum, inv) => sum + (inv.onHand || 0), 0)

    // Get default selling price (first available or 0)
    const price = Object.values(prices)[0] || 0

    // Use categories array for categoryId/categoryName
    const catId = (p.categories as string[])?.[0] || null

    return {
      systemId: p.systemId,
      id: p.id,
      name: p.name,
      barcode: p.barcode,
      brandId: p.brandId,
      brandName: p.brand?.name || null,
      categoryId: catId,
      categoryName: catId,
      costPrice: p.costPrice ? Number(p.costPrice) : 0,
      lastPurchasePrice: p.lastPurchasePrice ? Number(p.lastPurchasePrice) : 0,
      price,
      prices,
      unit: p.unit || 'Cái',
      status: p.status,
      thumbnailImage: p.thumbnailImage,
      pkgxId: p.pkgxId || null,
      totalStock,
      branchStocks,
    }
  })

  return { hits, estimatedTotal: total }
}
