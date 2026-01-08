import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/job-titles/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const jobTitle = await prisma.jobTitle.findUnique({
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
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!jobTitle) {
      return apiNotFound('Chức danh')
    }

    return apiSuccess(jobTitle)
  } catch (error) {
    console.error('Error fetching job title:', error)
    return apiError('Failed to fetch job title', 500)
  }
}

// PUT /api/job-titles/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return apiSuccess(jobTitle)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chức danh')
    }
    console.error('Error updating job title:', error)
    return apiError('Failed to update job title', 500)
  }
}

// DELETE /api/job-titles/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.jobTitle.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chức danh')
    }
    console.error('Error deleting job title:', error)
    return apiError('Failed to delete job title', 500)
  }
}
