import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'
import { updateUserSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/users/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const user = await prisma.user.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          include: {
            department: true,
            branch: true,
            jobTitle: true,
          },
        },
      },
    })

    if (!user) {
      return apiError('User không tồn tại', 404)
    }

    return apiSuccess(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return apiError('Failed to fetch user', 500)
  }
}

// PUT /api/users/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateUserSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const updateData: Parameters<typeof prisma.user.update>[0]['data'] = {
      email: body.email,
      role: body.role,
      isActive: body.isActive,
      employeeId: body.employeeId,
    }

    // If password is provided, hash it
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { systemId },
      data: updateData,
      select: {
        systemId: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
        employee: true,
      },
    })

    return apiSuccess(user)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('User không tồn tại', 404)
    }
    console.error('Error updating user:', error)
    return apiError('Failed to update user', 500)
  }
}

// DELETE /api/users/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.user.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('User không tồn tại', 404)
    }
    console.error('Error deleting user:', error)
    return apiError('Failed to delete user', 500)
  }
}
