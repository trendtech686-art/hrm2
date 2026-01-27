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
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.LeaveWhereInput = {};
    
    // Note: Leave table doesn't have isDeleted field
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (status) {
      where.status = status as LeaveStatus;
    }

    const [data, total] = await Promise.all([
      prisma.leave.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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

    // Transform data to include Vietnamese status
    const transformedData = data.map(leave => transformLeave(leave as unknown as Record<string, unknown>));

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
    startDate,
    endDate,
    totalDays,
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
        totalDays: totalDays || 1,
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
