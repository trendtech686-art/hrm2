import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'
import { cache } from '@/lib/cache'

export const dynamic = 'force-dynamic'

/**
 * POST /api/brands/bulk
 * Bulk operations: delete (soft), activate, deactivate
 *
 * Body: { action: 'delete' | 'activate' | 'deactivate', systemIds: string[] }
 */
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { action, systemIds } = body as {
      action: 'delete' | 'activate' | 'deactivate'
      systemIds: string[]
    }

    if (!action || !Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('Missing action or systemIds', 400)
    }

    let updatedCount = 0

    switch (action) {
      case 'delete': {
        const result = await prisma.brand.updateMany({
          where: { systemId: { in: systemIds } },
          data: { isDeleted: true, updatedAt: new Date() },
        })
        updatedCount = result.count
        break
      }

      case 'activate': {
        const result = await prisma.brand.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { isActive: true, updatedAt: new Date() },
        })
        updatedCount = result.count
        break
      }

      case 'deactivate': {
        const result = await prisma.brand.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { isActive: false, updatedAt: new Date() },
        })
        updatedCount = result.count
        break
      }

      default:
        return apiError(`Unknown action: ${action}`, 400)
    }

    // Invalidate brands cache
    cache.deletePattern('^brands:')

    return NextResponse.json({ success: true, updatedCount })
  } catch (error) {
    console.error('Bulk brands error:', error)
    return apiError('Failed to perform bulk action', 500)
  }
}
