import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/branches/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const branch = await prisma.branch.findUnique({
      where: { systemId },
      include: {
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            jobTitle: true,
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!branch) {
      return apiNotFound('Chi nhánh')
    }

    return apiSuccess(branch)
  } catch (error) {
    console.error('Error fetching branch:', error)
    return apiError('Failed to fetch branch', 500)
  }
}

// PUT /api/branches/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const branch = await prisma.branch.update({
      where: { systemId },
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        isDefault: body.isDefault,
        managerId: body.managerId ?? null,
        province: body.province ?? null,
        provinceId: body.provinceId ?? null,
        district: body.district ?? null,
        districtId: body.districtId ?? null,
        ward: body.ward ?? null,
        wardCode: body.wardCode ?? null,
        addressLevel: body.addressLevel ?? null,
      },
    })

    return apiSuccess(branch)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chi nhánh')
    }
    console.error('Error updating branch:', error)
    return apiError('Failed to update branch', 500)
  }
}

// DELETE /api/branches/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.branch.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chi nhánh')
    }
    console.error('Error deleting branch:', error)
    return apiError('Failed to delete branch', 500)
  }
}
