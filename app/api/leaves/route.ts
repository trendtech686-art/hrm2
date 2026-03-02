/**
 * Leaves API Route
 * 
 * GET    /api/leaves       - List all leave requests
 * POST   /api/leaves       - Create new leave request
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, LeaveStatus, LeaveType } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createLeaveSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

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
      };
      const mappedStatus = statusMap[status] || status;
      where.status = mappedStatus as LeaveStatus;
    }

    if (search) {
      where.OR = [
        { employeeName: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { employee: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

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
        include: {
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

    return apiPaginated(transformedData, { page, limit, total })
  } catch (error) {
    console.error('[Leaves API] GET error:', error);
    return apiError('Failed to fetch leaves', 500)
  }
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
    select: { systemId: true, id: true, fullName: true },
  });

  try {
    const leave = await prisma.leave.create({
      data: {
        systemId,
        id,
        employeeId,
        leaveType: (leaveType || 'ANNUAL') as LeaveType,
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
      include: {
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    });

    return apiSuccess(transformLeave(leave as unknown as Record<string, unknown>), 201)
  } catch (error) {
    console.error('[Leaves API] POST error:', error);
    return apiError('Failed to create leave request', 500)
  }
}
