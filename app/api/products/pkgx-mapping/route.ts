import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * PKGX Mapping API
 * Returns a map of pkgxId -> HRM product basic info for all linked products
 * This is optimized for the mapping lookup (lightweight, no pagination needed)
 * 
 * GET /api/products/pkgx-mapping
 * Returns: { [pkgxId: number]: { systemId, id, name, status } }
 */

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Fetch only linked products with minimal fields
    const linkedProducts = await prisma.product.findMany({
      where: {
        isDeleted: false,
        pkgxId: { not: null },
      },
      select: {
        systemId: true,
        id: true,
        name: true,
        status: true,
        pkgxId: true,
      },
    })

    // Build lookup map: pkgxId -> product info
    const mappingData: Record<number, {
      systemId: string
      id: string
      name: string
      status: string
    }> = {}

    for (const product of linkedProducts) {
      if (product.pkgxId) {
        mappingData[product.pkgxId] = {
          systemId: product.systemId,
          id: product.id,
          name: product.name,
          status: product.status,
        }
      }
    }

    return NextResponse.json({
      data: mappingData,
      count: linkedProducts.length,
    })
  } catch (error) {
    console.error('PKGX mapping error:', error)
    return apiError('Failed to fetch PKGX mapping', 500)
  }
}
