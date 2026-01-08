import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/departments/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const department = await prisma.department.findUnique({
      where: { systemId },
      include: {
        parent: true,
        children: true,
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            jobTitle: true,
          },
        },
        _count: { select: { employees: true, children: true } },
      },
    })

    if (!department) {
      return apiNotFound('Phòng ban')
    }

    return apiSuccess(department)
  } catch (error) {
    console.error('Error fetching department:', error)
    return apiError('Failed to fetch department', 500)
  }
}

// PUT /api/departments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const department = await prisma.department.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        parentId: body.parentId,
      },
      include: {
        parent: true,
      },
    })

    return apiSuccess(department)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Phòng ban')
    }
    console.error('Error updating department:', error)
    return apiError('Failed to update department', 500)
  }
}

// DELETE /api/departments/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.department.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Phòng ban')
    }
    console.error('Error deleting department:', error)
    return apiError('Failed to delete department', 500)
  }
}
