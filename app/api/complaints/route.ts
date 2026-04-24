import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { ComplaintStatus, ComplaintPriority } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createComplaintSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { notifyComplaintCreated } from '@/lib/complaint-notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/complaints - List all complaints
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

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

    const searchWhere = buildSearchWhere<Prisma.ComplaintWhereInput>(search, [
      'id',
      'title',
      'description',
      'customer.name',
      'orderCode',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

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
    // Resolve assignee names
    const assigneeIds = [...new Set(complaints.map(c => c.assigneeId).filter(Boolean) as string[])]
    const assigneeMap = new Map<string, string>()
    if (assigneeIds.length > 0) {
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: assigneeIds } },
        select: { systemId: true, fullName: true },
      })
      employees.forEach(e => assigneeMap.set(e.systemId, e.fullName))
    }

    const mappedComplaints = complaints.map(c => ({
      ...c,
      assignedTo: c.assigneeId, // Map assigneeId -> assignedTo for frontend
      assignedToName: c.assigneeId ? assigneeMap.get(c.assigneeId) || null : null,
      orderSystemId: c.orderId,
      customerSystemId: c.customerId,
      orderValue: c.orderValue ? Number(c.orderValue) : null, // ✅ Serialize Decimal
      timeline: c.timeline || [], // ✅ Ensure timeline is always array
    }));

    return apiPaginated(mappedComplaints, { page, limit, total })
  } catch (error) {
    logError('Error fetching complaints', error)
    return apiError('Không thể tải danh sách khiếu nại', 500)
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

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

    // Notify assigned employee (non-blocking)
    const assignedEmployeeId = complaint.assigneeId;
    const currentUserEmployeeId = session.user?.employeeId;
    if (assignedEmployeeId && assignedEmployeeId !== currentUserEmployeeId) {
      createNotification({
        type: 'complaint',
        title: 'Khiếu nại mới',
        message: `Bạn được giao khiếu nại "${complaint.title}" (${complaint.id})`,
        link: `/complaints/${complaint.systemId}`,
        recipientId: assignedEmployeeId,
        senderId: currentUserEmployeeId || undefined,
        senderName: session.user?.name || undefined,
        settingsKey: 'complaint:created',
      }).catch(e => logError('[Complaint] Creation notification failed', e));

      // Send email notification (non-blocking)
      notifyComplaintCreated({
        systemId: complaint.systemId,
        title: complaint.title,
        id: complaint.id,
        assigneeId: assignedEmployeeId,
        creatorName: session.user?.name,
      }).catch(e => logError('[Complaint] Creation email failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'complaint',
          entityId: complaint.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo khiếu nại: ${complaint.id} - Loại: ${complaint.type}`,
          metadata: { userName, complaintId: complaint.id, type: complaint.type },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] complaint create failed', e))
    return apiSuccess(complaint, 201)
  } catch (error) {
    logError('Error creating complaint', error)
    return apiError('Không thể tạo khiếu nại', 500)
  }
}
