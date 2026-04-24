import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createInventorySchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/inventory - List all inventory
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const productId = searchParams.get('productId')
    const locationId = searchParams.get('locationId')
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: Prisma.InventoryWhereInput = {}

    if (productId) {
      where.productId = productId
    }

    if (locationId) {
      where.locationId = locationId
    }

    const productSearch = buildSearchWhere<Prisma.ProductWhereInput>(search, ['name', 'id'])
    if (productSearch) {
      where.product = productSearch
    }

    // Filter low stock items
    if (lowStock) {
      where.quantity = {
        lte: 10, // Default low stock threshold
      }
    }

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: {
              systemId: true,
              id: true,
              name: true,
              imageUrl: true,
              unit: true,
            },
          },
          location: true,
        },
      }),
      prisma.inventory.count({ where }),
    ])

    return apiPaginated(inventory, { page, limit, total })
  } catch (error) {
    logError('Error fetching inventory', error)
    return apiError('Failed to fetch inventory', 500)
  }
}

// POST /api/inventory - Create/Update inventory
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createInventorySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate inventory ID
    const { systemId } = await generateNextIds('inventory-receipts')
    
    // Create new inventory record
    const inventory = await prisma.inventory.create({
      data: {
        systemId,
        productId: body.productId,
        locationId: body.locationId || '',
        quantity: body.quantity || 0,
        reservedQty: 0,
        updatedAt: new Date(),
      },
      include: {
        product: true,
        location: true,
      },
    })

    createActivityLog({
      entityType: 'inventory',
      entityId: systemId,
      action: `Tạo tồn kho cho sản phẩm ${inventory.product?.name || body.productId}`,
      actionType: 'create',
      metadata: {
        productId: body.productId,
        locationId: body.locationId,
        quantity: body.quantity,
        userName: session.user?.name || session.user?.email,
      },
      createdBy: session.user?.employeeId || session.user?.id,
    }).catch(() => undefined)

    return apiSuccess(inventory, 201)
  } catch (error) {
    logError('Error updating inventory', error)
    return apiError('Failed to update inventory', 500)
  }
}
