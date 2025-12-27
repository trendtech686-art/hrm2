/**
 * Leaves API Route
 * 
 * GET    /api/leaves       - List all leave requests
 * POST   /api/leaves       - Create new leave request
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List leaves
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const employeeId = searchParams.get('employeeId') || '';
    const status = searchParams.get('status') || '';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Note: Leave table doesn't have isDeleted field
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (status) {
      where.status = status;
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

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Leaves API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaves' },
      { status: 500 }
    );
  }
}

// POST - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
    } = body;

    const leave = await prisma.leave.create({
      data: {
        systemId,
        id,
        employeeId,
        leaveType: leaveType || 'ANNUAL',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        totalDays: totalDays || 1,
        reason: reason || null,
        status: status || 'PENDING',
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

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error('[Leaves API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}
