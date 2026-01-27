import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/roles/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const role = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (!role || role.isDeleted) {
      return apiNotFound('Vai trò')
    }

    return apiSuccess(role)
  } catch (error) {
    console.error('Error fetching role:', error)
    return apiError('Failed to fetch role', 500)
  }
}

// PUT /api/roles/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Check if it's a system role
    const existingRole = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (existingRole?.isSystem && body.isSystem === false) {
      return apiError('Không thể thay đổi vai trò hệ thống', 400)
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        permissions: body.permissions,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    })

    return apiSuccess(role)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Vai trò')
    }
    console.error('Error updating role:', error)
    return apiError('Failed to update role', 500)
  }
}

// DELETE /api/roles/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if it's a system role
    const existingRole = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (existingRole?.isSystem) {
      return apiError('Không thể xóa vai trò hệ thống', 400)
    }

    // Soft delete
    await prisma.roleSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ message: 'Đã xóa vai trò' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Vai trò')
    }
    console.error('Error deleting role:', error)
    return apiError('Failed to delete role', 500)
  }
}
