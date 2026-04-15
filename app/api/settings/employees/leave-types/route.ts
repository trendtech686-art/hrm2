import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { NextRequest } from 'next/server'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// GET /api/settings/employees/leave-types - Get all leave types from SettingsData
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const leaveTypes = await prisma.settingsData.findMany({
      where: {
        type: 'leave_type',
        isDeleted: false,
        isActive: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' },
      ],
    })

    // Transform to match LeaveType interface expected by frontend
    const transformed = leaveTypes.map(lt => ({
      systemId: lt.systemId,
      id: lt.id,
      name: lt.name,
      numberOfDays: (lt.metadata as Record<string, unknown>)?.maxDaysPerYear ?? 0,
      isPaid: (lt.metadata as Record<string, unknown>)?.isPaid ?? true,
      requiresAttachment: (lt.metadata as Record<string, unknown>)?.requiresDocument ?? false,
      applicableGender: 'All' as const,
      applicableDepartmentSystemIds: [],
      createdAt: lt.createdAt,
      updatedAt: lt.updatedAt,
    }))

    return apiSuccess(transformed)
  } catch (error) {
    logError('Error fetching leave types', error)
    return apiError('Failed to fetch leave types', 500)
  }
}

// POST /api/settings/employees/leave-types - Create new leave type
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    
    const leaveType = await prisma.settingsData.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        type: 'leave_type',
        isDefault: body.isDefault ?? false,
        isActive: true,
        metadata: {
          isPaid: body.isPaid ?? true,
          requiresDocument: body.requiresAttachment ?? false,
          maxDaysPerYear: body.numberOfDays ?? 0,
          applicableGender: body.applicableGender ?? 'All',
        },
        createdBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'leave_type',
      entityId: leaveType.systemId,
      action: `Thêm loại nghỉ phép: ${leaveType.name}`,
      actionType: 'create',
      changes: {
        'Tên': { from: null, to: leaveType.name },
        ...(body.numberOfDays ? { 'Số ngày': { from: null, to: body.numberOfDays } } : {}),
        ...(body.isPaid !== undefined ? { 'Hưởng lương': { from: null, to: body.isPaid ? 'Có' : 'Không' } } : {}),
        ...(body.requiresAttachment !== undefined ? { 'Y/C File': { from: null, to: body.requiresAttachment ? 'Có' : 'Không' } } : {}),
      },
      createdBy: session.user?.id,
    }).catch(e => logError('[leave-types] activity log failed', e))

    return apiSuccess({
      systemId: leaveType.systemId,
      id: leaveType.id,
      name: leaveType.name,
      numberOfDays: (leaveType.metadata as Record<string, unknown>)?.maxDaysPerYear ?? 0,
      isPaid: (leaveType.metadata as Record<string, unknown>)?.isPaid ?? true,
      requiresAttachment: (leaveType.metadata as Record<string, unknown>)?.requiresDocument ?? false,
      applicableGender: 'All' as const,
      applicableDepartmentSystemIds: [],
      createdAt: leaveType.createdAt,
      updatedAt: leaveType.updatedAt,
    })
  } catch (error) {
    logError('Error creating leave type', error)
    return apiError('Failed to create leave type', 500)
  }
}
