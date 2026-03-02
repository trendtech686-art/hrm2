import { prisma } from '@/lib/prisma'
import { PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// Status transitions validation (using actual DB enum values)
const VALID_TRANSITIONS: Record<string, string[]> = {
  'DRAFT': ['PROCESSING', 'COMPLETED'],
  'PROCESSING': ['COMPLETED', 'DRAFT'],
  'COMPLETED': ['PAID', 'PROCESSING'],
  'PAID': [],
}

// Map frontend status to DB enum
const STATUS_MAP: Record<string, PayrollStatus> = {
  'draft': 'DRAFT',
  'reviewed': 'PROCESSING',
  'locked': 'COMPLETED',
  'cancelled': 'DRAFT', // Revert to draft (no cancelled status in enum)
}

// Map DB enum to frontend status
const STATUS_MAP_REVERSE: Record<string, string> = {
  'DRAFT': 'draft',
  'PROCESSING': 'reviewed',
  'COMPLETED': 'locked',
  'PAID': 'locked',
}

// PATCH /api/payroll/[systemId]/status
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()
    const { status: frontendStatus, note } = body

    if (!frontendStatus) {
      return apiError('Status is required', 400)
    }

    // Get current payroll
    const payroll = await prisma.payroll.findUnique({
      where: { systemId },
      select: { systemId: true, status: true, year: true, month: true }
    })

    if (!payroll) {
      return apiError('Bảng lương không tồn tại', 404)
    }

    // Map frontend status to DB status
    const newDbStatus = STATUS_MAP[frontendStatus]
    if (!newDbStatus) {
      return apiError(`Invalid status: ${frontendStatus}`, 400)
    }

    // Validate transition
    const currentDbStatus = payroll.status
    const allowedTransitions = VALID_TRANSITIONS[currentDbStatus] || []
    if (!allowedTransitions.includes(newDbStatus)) {
      return apiError(
        `Không thể chuyển từ trạng thái ${STATUS_MAP_REVERSE[currentDbStatus]} sang ${frontendStatus}`,
        400
      )
    }

    // Update status
    const updateData: Record<string, unknown> = {
      status: newDbStatus,
      updatedAt: new Date(),
    }

    // Set processedAt/processedBy for completed status
    if (newDbStatus === 'COMPLETED') {
      updateData.processedAt = new Date()
      updateData.processedBy = session.user?.name || session.user?.email || 'system'
    }

    const updated = await prisma.payroll.update({
      where: { systemId },
      data: updateData,
      include: {
        items: {
          select: { systemId: true }
        }
      }
    })

    // Create audit log
    const actionMap: Record<string, string> = {
      'reviewed': 'review',
      'locked': 'lock',
      'draft': 'unlock',
      'cancelled': 'cancel',
    }
    
    // Get next audit log counter
    const lastAuditLog = await prisma.auditLog.findFirst({
      where: { systemId: { startsWith: 'LOG' } },
      orderBy: { systemId: 'desc' },
      select: { systemId: true },
    })
    const auditLogCounter = lastAuditLog?.systemId 
      ? parseInt(lastAuditLog.systemId.replace('LOG', '')) + 1
      : 1
    
    await prisma.auditLog.create({
      data: {
        systemId: `LOG${String(auditLogCounter).padStart(10, '0')}`,
        entityType: 'Payroll',
        entityId: systemId,
        action: actionMap[frontendStatus] || frontendStatus,
        userId: session.user?.email || 'system',
        userName: session.user?.name || session.user?.email || 'Hệ thống',
        oldData: { status: STATUS_MAP_REVERSE[currentDbStatus] },
        newData: { status: frontendStatus, note },
      },
    })

    // Transform response
    const monthKey = `${updated.year}-${String(updated.month).padStart(2, '0')}`
    const lastDay = new Date(updated.year, updated.month, 0).getDate()

    const result = {
      systemId: updated.systemId,
      id: updated.id,
      title: `Bảng lương tháng ${updated.month}/${updated.year}`,
      status: STATUS_MAP_REVERSE[updated.status] || 'draft',
      payPeriod: {
        startDate: `${updated.year}-${String(updated.month).padStart(2, '0')}-01`,
        endDate: `${updated.year}-${String(updated.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
      },
      payrollDate: updated.processedAt?.toISOString() || updated.createdAt.toISOString(),
      referenceAttendanceMonthKeys: [monthKey],
      payslipSystemIds: updated.items.map(item => item.systemId),
      totalGross: Number(updated.totalGross),
      totalDeductions: Number(updated.totalDeductions),
      totalNet: Number(updated.totalNet),
      totalEmployees: updated.totalEmployees,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }

    return apiSuccess(result)
  } catch (error) {
    console.error('Error updating payroll status:', error)
    return apiError(
      error instanceof Error ? error.message : 'Failed to update payroll status',
      500
    )
  }
}
