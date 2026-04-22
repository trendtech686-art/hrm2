import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { generateNextIds } from '@/lib/id-system'
import { stockLocationToStorageDto } from '@/lib/stock-location-storage-dto'

async function getDefaultBranch() {
  return (
    (await prisma.branch.findFirst({ where: { isDeleted: false, isDefault: true } })) ||
    (await prisma.branch.findFirst({ where: { isDeleted: false } }))
  )
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '1000')))
    const search = searchParams.get('search') || undefined
    const branchId = searchParams.get('branchId') || undefined
    const isActiveParam = searchParams.get('isActive')
    const isActive = isActiveParam === null ? undefined : isActiveParam === 'true'
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

    const safeSort: 'name' | 'id' | 'createdAt' | 'updatedAt' =
      sortBy === 'id' || sortBy === 'createdAt' || sortBy === 'updatedAt' ? sortBy : 'name'

    const andFilters: Prisma.StockLocationWhereInput[] = []
    if (isActive !== undefined) andFilters.push({ isActive })
    if (branchId) {
      andFilters.push({ OR: [{ branchSystemId: branchId }, { branchId }] })
    }
    if (search) {
      andFilters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      })
    }
    const where: Prisma.StockLocationWhereInput =
      andFilters.length > 0 ? { AND: andFilters } : {}

    const [raw, total] = await Promise.all([
      prisma.stockLocation.findMany({
        where,
        orderBy: { [safeSort]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockLocation.count({ where }),
    ])

    const data = raw.map(stockLocationToStorageDto)

    return apiSuccess({ data, total, page, pageSize: limit })
  } catch (error) {
    logError('Error fetching storage locations', error)
    return apiError('Failed to fetch storage locations', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, branchId: bodyBranchSystemId, isDefault = false, isActive = true } = body || {}
    if (!id || !name) return apiError('id and name are required', 400)

    const branch = await getDefaultBranch()
    if (!branch) return apiError('Chưa có chi nhánh — tạo chi nhánh trước khi thêm điểm lưu kho', 400)

    const { systemId } = await generateNextIds('stock-locations')

    let branchSystemId = branch.systemId
    let branchBusinessId = branch.id
    if (bodyBranchSystemId && typeof bodyBranchSystemId === 'string') {
      const b = await prisma.branch.findFirst({
        where: { isDeleted: false, OR: [{ systemId: bodyBranchSystemId }, { id: bodyBranchSystemId }] },
      })
      if (b) {
        branchSystemId = b.systemId
        branchBusinessId = b.id
      }
    }

    const created = await prisma.stockLocation.create({
      data: {
        systemId,
        id,
        name,
        description: description ?? null,
        code: id,
        branchId: branchBusinessId,
        branchSystemId,
        isDefault,
        isActive,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    const dto = stockLocationToStorageDto(created)

    createActivityLog({
      entityType: 'storage_location',
      entityId: created.systemId,
      action: `Thêm điểm lưu kho: ${name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch((e) => logError('Failed to create activity log', e))

    return apiSuccess(dto, 201)
  } catch (error) {
    logError('Error creating storage location', error)
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return apiError('Mã điểm lưu kho đã tồn tại', 400)
    }
    return apiError('Failed to create storage location', 500)
  }
}
