import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createAuditLogSchema } from './validation'

// GET /api/audit-logs - List audit logs
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const entity = searchParams.get('entity')
    const entityId = searchParams.get('entityId')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const where: Prisma.AuditLogWhereInput = {}

    if (entity) {
      where.entityType = entity
    }

    if (entityId) {
      where.entityId = entityId
    }

    if (action) {
      where.action = action
    }

    if (userId) {
      where.userId = userId
    }

    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) where.createdAt.gte = new Date(fromDate)
      if (toDate) where.createdAt.lte = new Date(toDate)
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ])

    return apiPaginated(logs, { page, limit, total })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return apiError('Failed to fetch audit logs', 500)
  }
}

// POST /api/audit-logs - Create audit log entry
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createAuditLogSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const log = await prisma.auditLog.create({
      data: {
        systemId: `ACT${String(Date.now()).slice(-6).padStart(6, '0')}`,
        entityType: body.entityType,
        entityId: body.entityId,
        action: body.action,
        oldData: body.oldData,
        newData: body.newData,
        changes: body.oldData || body.newData ? { old: body.oldData, new: body.newData } : undefined,
        entityName: body.entityName || body.description,
        userId: body.userId,
        ipAddress: body.ipAddress,
        userAgent: body.userAgent,
      },
    })

    return apiSuccess(log, 201)
  } catch (error) {
    console.error('Error creating audit log:', error)
    return apiError('Failed to create audit log', 500)
  }
}
