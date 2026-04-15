/**
 * Penalties API
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNextIds } from '@/lib/id-system';
import { requireAuth, apiSuccess, apiError, apiPaginated, parsePagination } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Helper: normalize English status to Vietnamese display status
function mapPenaltyStatus(status: string): string {
  switch (status) {
    case 'pending': return 'Chưa thanh toán';
    case 'paid':
    case 'DEDUCTED': return 'Đã thanh toán';
    case 'cancelled': return 'Đã hủy';
    case 'Chưa thanh toán':
    case 'Đã thanh toán':
    case 'Đã hủy':
      return status;
    default: return status;
  }
}

// Helper to serialize Decimal fields and map Prisma fields to frontend types
function serializePenalty(p: Record<string, unknown>) {
  return {
    ...p,
    // Map Prisma field names to frontend type names
    employeeSystemId: p.employeeId ?? p.employeeSystemId,
    penaltyTypeSystemId: p.penaltyTypeId ?? p.penaltyTypeSystemId,
    issueDate: p.date ?? p.issueDate,
    // Normalize status
    status: mapPenaltyStatus(String(p.status || 'Chưa thanh toán')),
    // Convert Decimal to number
    amount: typeof p.amount === 'object' && p.amount !== null && 'toNumber' in (p.amount as object)
      ? (p.amount as { toNumber(): number }).toNumber()
      : Number(p.amount),
  };
}

// GET /api/penalties
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const employeeSystemId = searchParams.get('employeeSystemId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: Record<string, unknown> = {};
    
    if (employeeSystemId) where.employeeId = employeeSystemId;
    const linkedComplaintSystemId = searchParams.get('linkedComplaintSystemId');
    if (linkedComplaintSystemId) where.linkedComplaintSystemId = linkedComplaintSystemId;
    // Support comma-separated statuses for multi-select
    if (status) {
      const statuses = status.split(',').map(s => s.trim()).filter(Boolean);
      where.status = statuses.length === 1 ? statuses[0] : { in: statuses };
    }
    if (category) {
      const categories = category.split(',').map(c => c.trim()).filter(Boolean);
      where.category = categories.length === 1 ? categories[0] : { in: categories };
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
    }
    
    // Server-side search
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { employeeName: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { penaltyTypeName: { contains: search, mode: 'insensitive' } },
        { issuerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Map frontend column names to Prisma field names
    const sortFieldMap: Record<string, string> = {
      issueDate: 'date',
      employeeName: 'employeeName',
      amount: 'amount',
      status: 'status',
      category: 'category',
      createdAt: 'createdAt',
      id: 'id',
    };
    const orderByField = sortFieldMap[sortBy] || sortBy;

    const [data, total] = await Promise.all([
      prisma.penalty.findMany({
        where,
        orderBy: { [orderByField]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.penalty.count({ where }),
    ]);

    return apiPaginated(data.map(d => serializePenalty(d as unknown as Record<string, unknown>)), { page, limit, total });
  } catch (error) {
    logError('[Penalties API] GET error', error);
    return apiError('Không thể tải danh sách phiếu phạt', 500);
  }
}

// POST /api/penalties
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Chưa được xác thực', 401);

  try {
    const body = await request.json();
    
    const { systemId, businessId: id } = await generateNextIds('penalties');

    const penalty = await prisma.penalty.create({
      data: {
        systemId,
        id,
        employeeId: body.employeeId || body.employeeSystemId,
        employeeName: body.employeeName,
        penaltyTypeId: body.penaltyTypeId || body.penaltyTypeSystemId,
        penaltyTypeName: body.penaltyTypeName,
        amount: body.amount,
        reason: body.reason,
        date: body.date ? new Date(body.date) : new Date(),
        status: body.status || 'Chưa thanh toán',
        category: body.category,
        issuerName: session.user.name,
        issuerSystemId: session.user.id,
        linkedComplaintSystemId: body.linkedComplaintSystemId,
        linkedOrderSystemId: body.linkedOrderSystemId,
        createdBy: session.user.id,
      },
    });

    // ✅ Notify employee about new penalty
    const penaltyEmployeeId = body.employeeId || body.employeeSystemId
    if (penaltyEmployeeId && penaltyEmployeeId !== session.user?.employeeId) {
      createNotification({
        type: 'penalty',
        settingsKey: 'penalty:updated',
        title: 'Phạt mới',
        message: `Bạn có một khoản phạt mới: ${body.reason || penalty.id}`,
        link: `/penalties`,
        recipientId: penaltyEmployeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Penalties POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'penalty',
          entityId: penalty.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu phạt`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] penalty create failed', e))

    return apiSuccess(serializePenalty(penalty as unknown as Record<string, unknown>), 201);
  } catch (error) {
    logError('[Penalties API] POST error', error);
    return apiError('Không thể tạo phiếu phạt', 500);
  }
}
