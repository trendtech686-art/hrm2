import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { createSyncLogSchema } from './validation'

// GET /api/settings/pkgx/sync-logs - List sync logs
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { limit } = parsePagination(searchParams)
    const syncType = searchParams.get('syncType')

    const logs = await prisma.pkgxSyncLog.findMany({
      where: syncType ? { syncType } : undefined,
      orderBy: { syncedAt: 'desc' },
      take: limit,
    })

    return apiSuccess({ 
      data: logs,
      total: logs.length,
    })
  } catch (error) {
    console.error('Error fetching sync logs:', error)
    return apiError('Failed to fetch sync logs', 500)
  }
}

// POST /api/settings/pkgx/sync-logs - Create a new sync log
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createSyncLogSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }

  try {
    const { 
      syncType, 
      action, 
      status, 
      itemsTotal = 0, 
      itemsSuccess = 0, 
      itemsFailed = 0, 
      errorMessage,
      details,
    } = validation.data

    const log = await prisma.pkgxSyncLog.create({
      data: {
        syncType,
        action,
        status,
        itemsTotal,
        itemsSuccess,
        itemsFailed,
        errorMessage,
        details,
        syncedBy: session.user?.id,
        syncedByName: session.user?.name || session.user?.email || 'Unknown',
      },
    })

    return apiSuccess({ data: log }, 201)
  } catch (error) {
    console.error('Error creating sync log:', error)
    return apiError('Failed to create sync log', 500)
  }
}
