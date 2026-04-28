import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createStockLocationSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/stock-locations - List all stock locations
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search') || ''
    const branchSystemId = searchParams.get('branchSystemId')

    const where: Prisma.StockLocationWhereInput = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (branchSystemId) {
      where.branchId = branchSystemId
    }

    if (all) {
      const locations = await prisma.stockLocation.findMany({
        where,
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          id: true,
          name: true,
          code: true,
          description: true,
          branchId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { inventoryRecords: true } },
        },
      })
      return apiSuccess({ data: locations })
    }

    const skip = (page - 1) * limit
    const [locations, total] = await Promise.all([
      prisma.stockLocation.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        select: {
          systemId: true,
          id: true,
          name: true,
          code: true,
          description: true,
          branchId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { inventoryRecords: true } },
        },
      }),
      prisma.stockLocation.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return apiSuccess({
      data: locations,
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    logError('Error fetching stock locations', error)
    return apiError('Failed to fetch stock locations', 500)
  }
}

// POST /api/stock-locations - Create new stock location
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createStockLocationSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data
    
    const { systemId } = await generateNextIds('stock-locations')

    const location = await prisma.stockLocation.create({
      data: {
        systemId,
        id: body.id || '',
        name: body.name || '',
        code: body.code || body.id || '',
        description: body.address || body.description,
        branchId: body.branchId || '',
        isActive: body.isActive ?? true,
      },
    })

    createActivityLog({
      entityType: 'stock_location',
      entityId: location.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { name: location.name, businessId: location.id },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(location, 201)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('Mã kho đã tồn tại', 400)
    }
    logError('Error creating stock location', error)
    return apiError('Failed to create stock location', 500)
  }
}
