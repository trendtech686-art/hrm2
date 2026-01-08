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

    return apiPaginated(data, { page, limit, total })
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
    systemId,
    id,
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

    return apiSuccess(leave, 201)
  } catch (error) {
    console.error('[Leaves API] POST error:', error);
    return apiError('Failed to create leave request', 500)
  }
}
