import { prisma } from '@/lib/prisma'
import { Prisma, ComplaintPriority, ComplaintStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateComplaintSchema } from './validation'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/complaints/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const complaint = await prisma.complaint.findUnique({
      where: { systemId },
      include: {
        customer: true,
        employees: true,
      },
    })

    if (!complaint) {
      return apiError('Khiếu nại không tồn tại', 404)
    }

    return apiSuccess(complaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return apiError('Failed to fetch complaint', 500)
  }
}

// PUT /api/complaints/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateComplaintSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority as ComplaintPriority | undefined,
        status: body.status as ComplaintStatus | undefined,
        assigneeId: body.assigneeId || body.assignedTo,
        resolution: body.resolution,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
      include: {
        customer: true,
      },
    })

    return apiSuccess(complaint)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    console.error('Error updating complaint:', error)
    return apiError('Failed to update complaint', 500)
  }
}

// DELETE /api/complaints/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.complaint.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Khiếu nại không tồn tại', 404)
    }
    console.error('Error deleting complaint:', error)
    return apiError('Failed to delete complaint', 500)
  }
}
