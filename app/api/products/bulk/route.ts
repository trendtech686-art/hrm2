import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/products/bulk
 * Bulk operations: delete (soft), restore, updateStatus
 * 
 * Body: { action: 'delete' | 'restore' | 'updateStatus', systemIds: string[], status?: string }
 */
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { action, systemIds, status } = body as {
      action: 'delete' | 'restore' | 'updateStatus'
      systemIds: string[]
      status?: string
    }

    if (!action || !Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('Missing action or systemIds', 400)
    }

    let updatedCount = 0

    switch (action) {
      case 'delete': {
        // Soft delete
        const deleteResult = await prisma.product.updateMany({
          where: { systemId: { in: systemIds } },
          data: { isDeleted: true, updatedAt: new Date() },
        })
        updatedCount = deleteResult.count
        break
      }

      case 'restore': {
        const restoreResult = await prisma.product.updateMany({
          where: { systemId: { in: systemIds } },
          data: { isDeleted: false, updatedAt: new Date() },
        })
        updatedCount = restoreResult.count
        break
      }

      case 'updateStatus': {
        if (!status) return apiError('Missing status for updateStatus action', 400)
        const statusResult = await prisma.product.updateMany({
          where: { systemId: { in: systemIds }, isDeleted: false },
          data: { status: status as 'ACTIVE' | 'INACTIVE', updatedAt: new Date() },
        })
        updatedCount = statusResult.count
        break
      }

      default:
        return apiError(`Unknown action: ${action}`, 400)
    }

    return NextResponse.json({ success: true, updatedCount })
  } catch (error) {
    console.error('Bulk products error:', error)
    return apiError('Failed to perform bulk action', 500)
  }
}
