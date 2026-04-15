import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { NextResponse } from 'next/server'

/**
 * Products Unlinked API
 * Returns HRM products that are NOT linked to PKGX (pkgxId is null)
 * 
 * GET /api/products/unlinked?page=1&limit=20&search=...
 */

const UNLINKED_PRODUCT_SELECT = {
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
  createdAt: true,
  updatedAt: true,
} as const

export const GET = apiHandler(async (request, _ctx) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit
    const search = searchParams.get('search')?.trim() || ''

    // Build WHERE clause - only products WITHOUT pkgxId
    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      pkgxId: null,
    }

    // Text search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search } },
      ]
    }

    // Count total
    const total = await prisma.product.count({ where })

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      select: UNLINKED_PRODUCT_SELECT,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
})
