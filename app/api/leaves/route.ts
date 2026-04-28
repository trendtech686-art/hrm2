/**
 * Leaves API Route
 * 
 * GET    /api/leaves       - List all leave requests
 * POST   /api/leaves       - Create new leave request
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, LeaveStatus, LeaveType } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination, serializeDecimals } from '@/lib/api-utils'
import { createLeaveSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createBulkNotifications } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// Status mapping from enum to Vietnamese for response
const statusToVietnamese: Record<string, string> = {
  'PENDING': 'Chờ duyệt',
  'APPROVED': 'Đã duyệt',
  'REJECTED': 'Đã từ chối',
  'CANCELLED': 'Đã hủy',
};

// Leave type mapping from enum to Vietnamese
const leaveTypeToVietnamese: Record<string, string> = {
  'ANNUAL': 'Phép năm',
  'SICK': 'Nghỉ ốm',
  'UNPAID': 'Nghỉ không lương',
  'MATERNITY': 'Thai sản',
  'PATERNITY': 'Nghỉ chăm con',
  'BEREAVEMENT': 'Nghỉ tang',
  'WEDDING': 'Nghỉ cưới',
  'OTHER': 'Khác',
};

// Transform leave data to include Vietnamese status
const transformLeave = (leave: Record<string, unknown>) => ({
  ...leave,
  status: statusToVietnamese[leave.status as string] || leave.status,
});

// GET - List leaves
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams)
    const employeeId = searchParams.get('employeeId') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';
    const leaveType = searchParams.get('leaveType') || '';

    const where: Prisma.LeaveWhereInput = {};
    
    // Note: Leave table doesn't have isDeleted field
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (status && status !== 'all') {
      // Map Vietnamese status back to enum
      const statusMap: Record<string, LeaveStatus> = {
        'Chờ duyệt': 'PENDING',
        'Đã duyệt': 'APPROVED',
        'Đã từ chối': 'REJECTED',
        'Đã hủy': 'CANCELLED',
        'pending': 'PENDING',
        'approved': 'APPROVED',
        'rejected': 'REJECTED',
        'cancelled': 'CANCELLED',
      };
      const mappedStatus = statusMap[status] || status.toUpperCase();
      where.status = mappedStatus as LeaveStatus;
    }

    const searchWhere = buildSearchWhere<Prisma.LeaveWhereInput>(search, [
      'employeeName',
      'reason',
      'employee.fullName',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    // Date range filter: find leaves that OVERLAP the given date range
    // A leave overlaps [fromDate, toDate] when leave.startDate <= toDate AND leave.endDate >= fromDate
    if (fromDate || toDate) {
      if (fromDate) where.endDate = { ...(where.endDate as object || {}), gte: new Date(fromDate) };
      if (toDate) where.startDate = { ...(where.startDate as object || {}), lte: new Date(toDate) };
    }

    // Leave type filter
    if (leaveType) {
      const typeMap: Record<string, LeaveType> = {
        'Phép năm': 'ANNUAL',
        'Nghỉ ốm': 'SICK',
        'Nghỉ không lương': 'UNPAID',
        'Thai sản': 'MATERNITY',
        'Nghỉ chăm con': 'PATERNITY',
        'Khác': 'OTHER',
      };
      const mappedType = typeMap[leaveType] || leaveType;
      where.leaveType = mappedType as LeaveType;
    }

    // Build orderBy
    const orderBy: Prisma.LeaveOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      prisma.leave.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          systemId: true,
          id: true,
          employeeId: true,
          employeeSystemId: true,
          employeeBusinessId: true,
          employeeName: true,
          leaveType: true,
          leaveTypeName: true,
          leaveTypeSystemId: true,
          leaveTypeId: true,
          leaveTypeIsPaid: true,
          leaveTypeRequiresAttachment: true,
          startDate: true,
          endDate: true,
          totalDays: true,
          numberOfDays: true,
          reason: true,
          status: true,
          approvedBy: true,
          approvedAt: true,
          rejectedBy: true,
          rejectedAt: true,
          rejectionReason: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          employee: {
            select: {
              systemId: true,
              id: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.leave.count({ where }),
    ]);

    // Transform data to include Vietnamese status and employee info
    const transformedData = data.map(leave => ({
      ...transformLeave(leave as unknown as Record<string, unknown>),
      employeeSystemId: leave.employee?.systemId || leave.employeeId || leave.employeeSystemId,
      employeeId: leave.employee?.id || leave.employeeBusinessId,
      employeeName: leave.employee?.fullName || leave.employeeName || 'N/A',
      // ✅ Fix: Convert leaveType enum to Vietnamese if leaveTypeName is empty
      leaveTypeName: leave.leaveTypeName || leaveTypeToVietnamese[leave.leaveType] || leave.leaveType,
      leaveTypeSystemId: leave.leaveTypeSystemId,
      leaveTypeId: leave.leaveTypeId,
      leaveTypeIsPaid: leave.leaveTypeIsPaid,
      leaveTypeRequiresAttachment: leave.leaveTypeRequiresAttachment,
    }));

    return apiPaginated(serializeDecimals(transformedData), { page, limit, total })
  } catch (error) {
    logError('[Leaves API] GET error', error);
    return apiError('Failed to fetch leaves', 500)
  }
}

// Vietnamese name → Prisma LeaveType enum mapping
const LEAVE_TYPE_NAME_MAP: Record<string, string> = {
  'Nghỉ phép năm': 'ANNUAL',
  'Phép năm': 'ANNUAL',
  'Nghỉ ốm': 'SICK',
  'Nghỉ thai sản': 'MATERNITY',
  'Nghỉ việc riêng': 'PATERNITY',
  'Nghỉ không lương': 'UNPAID',
  'Nghỉ lễ': 'OTHER',
  'Khác': 'OTHER',
}

function resolveLeaveTypeEnum(value: string): string {
  const validEnums = ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'OTHER']
  if (validEnums.includes(value)) return value
  return LEAVE_TYPE_NAME_MAP[value] || 'OTHER'
}

// POST - Create new leave request
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createLeaveSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const {
    systemId: providedSystemId,
    id: providedId,
    employeeId,
    leaveType,
    leaveTypeName,
    leaveTypeSystemId,
    leaveTypeId,
    leaveTypeIsPaid,
    leaveTypeRequiresAttachment,
    startDate,
    endDate,
    totalDays,
    numberOfDays,
    reason,
    status,
    approvedBy,
    approvedAt,
    rejectedBy,
    rejectedAt,
    rejectionReason,
  } = validation.data

  // Auto-generate IDs if not provided
  let systemId = providedSystemId;
  let id = providedId;
  
  if (!systemId || !id) {
    const generatedIds = await generateNextIds('leaves');
    systemId = systemId || generatedIds.systemId;
    id = id || generatedIds.businessId;
  }

  // Get employee info for denormalization
  const employee = await prisma.employee.findUnique({
    where: { systemId: employeeId },
    select: { systemId: true, id: true, fullName: true, managerId: true },
  });

  try {
    const leave = await prisma.leave.create({
      data: {
        systemId,
        id,
        employeeId,
        leaveType: resolveLeaveTypeEnum(leaveType || 'ANNUAL') as LeaveType,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        totalDays: totalDays || numberOfDays || 1,
        numberOfDays: numberOfDays || totalDays || 1,
        reason: reason || null,
        status: (status || 'PENDING') as LeaveStatus,
        approvedBy: approvedBy || null,
        approvedAt: approvedAt ? new Date(approvedAt) : null,
        rejectedBy: rejectedBy || null,
        rejectedAt: rejectedAt ? new Date(rejectedAt) : null,
        rejectionReason: rejectionReason || null,
        // Denormalized employee info
        employeeSystemId: employee?.systemId,
        employeeBusinessId: employee?.id,
        employeeName: employee?.fullName,
        // Leave type info
        leaveTypeName: leaveTypeName || leaveType,
        leaveTypeSystemId: leaveTypeSystemId || null,
        leaveTypeId: leaveTypeId || null,
        leaveTypeIsPaid: leaveTypeIsPaid ?? true,
        leaveTypeRequiresAttachment: leaveTypeRequiresAttachment ?? false,
      },
      select: {
        systemId: true,
        id: true,
        employeeId: true,
        employeeSystemId: true,
        employeeBusinessId: true,
        employeeName: true,
        leaveType: true,
        leaveTypeName: true,
        leaveTypeSystemId: true,
        leaveTypeId: true,
        leaveTypeIsPaid: true,
        leaveTypeRequiresAttachment: true,
        startDate: true,
        endDate: true,
        totalDays: true,
        numberOfDays: true,
        reason: true,
        status: true,
        approvedBy: true,
        approvedAt: true,
        rejectedBy: true,
        rejectedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Notify manager about new leave request (non-blocking)
    if (employee?.managerId) {
      const typeName = leaveTypeName || leaveTypeToVietnamese[leaveType || 'ANNUAL'] || leaveType;
      const days = totalDays || numberOfDays || 1;
      createBulkNotifications({
        type: 'leave',
        settingsKey: 'leave:updated',
        title: 'Đơn xin nghỉ phép mới',
        message: `${employee.fullName} xin nghỉ ${typeName} (${days} ngày)`,
        link: '/leaves',
        recipientIds: [employee.managerId],
        senderId: employee.systemId,
        senderName: employee.fullName || undefined,
      }).catch(e => logError('[Leaves] New leave notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'leave',
          entityId: leave.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo đơn nghỉ phép`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] leave create failed', e))

    return apiSuccess(serializeDecimals(transformLeave(leave as unknown as Record<string, unknown>)), 201)
  } catch (error) {
    logError('[Leaves API] POST error', error);
    return apiError('Failed to create leave request', 500)
  }
}
