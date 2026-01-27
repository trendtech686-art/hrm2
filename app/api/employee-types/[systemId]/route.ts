import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/employee-types/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const employeeType = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })

    if (!employeeType || employeeType.isDeleted) {
      return apiNotFound('Loại nhân viên')
    }

    return apiSuccess(employeeType)
  } catch (error) {
    console.error('Error fetching employee type:', error)
    return apiError('Failed to fetch employee type', 500)
  }
}

// PUT /api/employee-types/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await prisma.employeeTypeSetting.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        isDefault: body.isDefault,
        sortOrder: body.sortOrder,
      },
    })

    return apiSuccess(employeeType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại nhân viên')
    }
    console.error('Error updating employee type:', error)
    return apiError('Failed to update employee type', 500)
  }
}

// DELETE /api/employee-types/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ message: 'Đã xóa loại nhân viên' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại nhân viên')
    }
    console.error('Error deleting employee type:', error)
    return apiError('Failed to delete employee type', 500)
  }
}
