import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { NextResponse } from 'next/server'
import { serializeDecimals } from '@/lib/api-utils'

/**
 * Products Linked API
 * Returns products that are linked to PKGX (have pkgxId)
 * Includes PKGX product data via server-side JOIN to avoid client needing full cache
 * 
 * GET /api/products/linked?page=1&limit=20&search=...
 */

const LINKED_PRODUCT_SELECT = {
  systemId: true,
  id: true,
  name: true,
  thumbnailImage: true,
  barcode: true,
  costPrice: true,
  status: true,
  pkgxId: true,
  brandId: true,
  categorySystemIds: true,
  inventoryByBranch: true,
  description: true,
  shortDescription: true,
  seoDescription: true,
  seoKeywords: true,
  ktitle: true,
  sellerNote: true,
  createdAt: true,
  updatedAt: true,
} as const

export const GET = apiHandler(async (request, _ctx) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit
    const search = searchParams.get('search')?.trim() || ''

    // Build WHERE clause - only products with pkgxId
    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      pkgxId: { not: null },
    }

    // Text search - also search in PKGX product data
    if (search) {
      // Find PKGX products matching the search
      const matchingPkgxProducts = await prisma.pkgxProduct.findMany({
        where: {
          OR: [
            { goodsSn: { contains: search, mode: 'insensitive' } },
            { goodsNumber: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
      })
      const matchingPkgxIds = matchingPkgxProducts.map(p => p.id)

      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        ...(matchingPkgxIds.length > 0 ? [{ pkgxId: { in: matchingPkgxIds } }] : []),
      ]
    }

    // Count total
    const total = await prisma.product.count({ where })

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      select: LINKED_PRODUCT_SELECT,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    })

    // Enrich with PKGX product data (server-side JOIN)
    const pkgxIds = products.map(p => p.pkgxId).filter((id): id is number => id !== null)
    let pkgxMap = new Map<number, Record<string, unknown>>()
    
    if (pkgxIds.length > 0) {
      const pkgxProducts = await prisma.pkgxProduct.findMany({
        where: { id: { in: pkgxIds } },
      })
      pkgxMap = new Map(pkgxProducts.map(p => [p.id, serializeDecimals(p) as Record<string, unknown>]))
    }

    const enrichedProducts = products.map(p => ({
      ...p,
      pkgxProduct: p.pkgxId ? pkgxMap.get(p.pkgxId) || null : null,
    }))

    return NextResponse.json({
      data: enrichedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
})
