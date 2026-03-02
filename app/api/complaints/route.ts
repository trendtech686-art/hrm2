import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { ComplaintStatus, ComplaintPriority } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createComplaintSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

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
    const type = searchParams.get('type')
    const assignedTo = searchParams.get('assignedTo')
    const customerId = searchParams.get('customerId')
    const orderSystemId = searchParams.get('orderSystemId')
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.ComplaintWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { orderCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status as ComplaintStatus
    }

    if (priority) {
      where.priority = priority as ComplaintPriority
    }

    if (type) {
      where.type = type
    }

    if (assignedTo) {
      where.assigneeId = assignedTo
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (orderSystemId) {
      where.orderId = orderSystemId
    }

    if (branchId) {
      where.branchSystemId = branchId
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) (where.createdAt as Prisma.DateTimeFilter).gte = new Date(startDate)
      if (endDate) (where.createdAt as Prisma.DateTimeFilter).lte = new Date(endDate)
    }

    // Map frontend column names to Prisma field names
    const sortFieldMap: Record<string, string> = {
      complaintId: 'id',
      customerName: 'customerName',
      orderCode: 'orderCode',
      type: 'type',
      priority: 'priority',
      status: 'status',
      assignedTo: 'assigneeId',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      resolvedAt: 'resolvedAt',
    }
    const orderByField = sortFieldMap[sortBy] || sortBy

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          customer: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.complaint.count({ where }),
    ])

    // ⭐ Map DB fields to TypeScript types + serialize Decimal
    const mappedComplaints = complaints.map(c => ({
      ...c,
      assignedTo: c.assigneeId, // Map assigneeId -> assignedTo for frontend
      orderSystemId: c.orderId,
      customerSystemId: c.customerId,
      orderValue: c.orderValue ? Number(c.orderValue) : null, // ✅ Serialize Decimal
      timeline: c.timeline || [], // ✅ Ensure timeline is always array
    }));

    return apiPaginated(mappedComplaints, { page, limit, total })
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

    const complaint = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'complaints',
        body.id?.trim() || undefined
      );

      return tx.complaint.create({
        data: {
          systemId,
          id: businessId,
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
      });
    });

    return apiSuccess(complaint, 201)
  } catch (error) {
    console.error('Error creating complaint:', error)
    return apiError('Failed to create complaint', 500)
  }
}
