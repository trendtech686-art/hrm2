import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { ComplaintStatus, ComplaintPriority } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createComplaintSchema } from './validation'

// GET /api/complaints - List all complaints
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const customerId = searchParams.get('customerId')

    const where: Prisma.ComplaintWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status as ComplaintStatus
    }

    if (priority) {
      where.priority = priority as ComplaintPriority
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.complaint.count({ where }),
    ])

    return apiPaginated(complaints, { page, limit, total })
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return apiError('Failed to fetch complaints', 500)
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createComplaintSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    // Generate business ID
    if (!body.id) {
      const lastComplaint = await prisma.complaint.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastComplaint?.id 
        ? parseInt(lastComplaint.id.replace('KN', '')) 
        : 0
      body.id = `KN${String(lastNum + 1).padStart(6, '0')}`
    }

    const complaint = await prisma.complaint.create({
      data: {
        systemId: `COMP${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        customerId: body.customerId,
        orderId: body.orderId,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: (body.priority || 'MEDIUM') as ComplaintPriority,
        status: (body.status || 'OPEN') as ComplaintStatus,
        assigneeId: body.assigneeId || body.assignedTo,
      },
      include: {
        customer: true,
      },
    })

    return apiSuccess(complaint, 201)
  } catch (error) {
    console.error('Error creating complaint:', error)
    return apiError('Failed to create complaint', 500)
  }
}
