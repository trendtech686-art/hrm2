import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * Products Linked API
 * Returns products that are linked to PKGX (have pkgxId)
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
  categorySystemIds: true, // Fixed: was categorySystemId (singular)
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

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
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
      select: LINKED_PRODUCT_SELECT,
      orderBy: { updatedAt: 'desc' },
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
  } catch (error) {
    console.error('Products linked error:', error)
    return apiError('Failed to fetch linked products', 500)
  }
}
