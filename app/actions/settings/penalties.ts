'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type Penalty = NonNullable<Awaited<ReturnType<typeof prisma.penalty.findFirst>>>;

// Helper: normalize English status to Vietnamese display status
function mapPenaltyStatus(status: string): string {
  switch (status) {
    case 'pending': return 'Chưa thanh toán';
    case 'paid': return 'Đã thanh toán';
    case 'cancelled': return 'Đã hủy';
    // Already Vietnamese - keep as-is
    case 'Chưa thanh toán':
    case 'Đã thanh toán':
    case 'Đã hủy':
      return status;
    default: return status;
  }
}

// Helper to serialize penalty for client (convert Decimal to number, normalize status)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializePenalty(penalty: Penalty): any {
  return {
    ...penalty,
    status: mapPenaltyStatus(penalty.status),
    amount: typeof penalty.amount === 'object' && penalty.amount !== null && 'toNumber' in penalty.amount
      ? (penalty.amount as { toNumber(): number }).toNumber()
      : Number(penalty.amount),
  };
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PenaltyFilters {
  page?: number;
  limit?: number;
  search?: string;
  employeeId?: string;
  penaltyTypeId?: string;
  status?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedPenalties {
  data: Penalty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPenalties(
  filters: PenaltyFilters = {}
): Promise<ActionResult<PaginatedPenalties>> {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      employeeId, 
      penaltyTypeId,
      status,
      category,
      startDate,
      endDate,
    } = filters;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { reason: { contains: search, mode: 'insensitive' } },
        { issuerName: { contains: search, mode: 'insensitive' } },
        { systemId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (employeeId) where.employeeId = employeeId;
    if (penaltyTypeId) where.penaltyTypeId = penaltyTypeId;
    if (status) where.status = status;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date as Record<string, unknown>).gte = startDate;
      if (endDate) (where.date as Record<string, unknown>).lte = endDate;
    }

    const [data, total] = await Promise.all([
      prisma.penalty.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.penalty.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data: data.map(serializePenalty),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch penalties:', error);
    return { success: false, error: 'Không thể tải danh sách phạt' };
  }
}

export async function getPenaltyById(
  systemId: string
): Promise<ActionResult<Penalty>> {
  try {
    const penalty = await prisma.penalty.findUnique({
      where: { systemId },
    });
    
    if (!penalty) {
      return { success: false, error: 'Không tìm thấy phiếu phạt' };
    }
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to fetch penalty:', error);
    return { success: false, error: 'Không thể tải thông tin phiếu phạt' };
  }
}

export async function createPenalty(
  data: Record<string, unknown>
): Promise<ActionResult<Penalty>> {
  try {
    const systemId = await generateIdWithPrefix('PP', prisma);
    const id = systemId;

    // Map field names from frontend to DB schema
    const penaltyData = {
      systemId,
      id,
      employeeId: data.employeeSystemId || data.employeeId, // Support both field names
      employeeName: data.employeeName,
      penaltyTypeId: data.penaltyTypeSystemId || data.penaltyTypeId, // Support both field names
      penaltyTypeName: data.penaltyTypeName,
      amount: data.amount,
      reason: data.reason,
      date: data.date ? new Date(data.date as string) : new Date(),
      status: mapPenaltyStatus(data.status as string || 'pending'),
      category: data.category,
      issuerName: data.issuerName,
      issuerSystemId: data.issuerSystemId,
      linkedComplaintSystemId: data.linkedComplaintSystemId,
      linkedOrderSystemId: data.linkedOrderSystemId,
      createdBy: data.createdBy,
    };

    const penalty = await prisma.penalty.create({
      data: penaltyData as Parameters<typeof prisma.penalty.create>[0]['data'],
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to create penalty:', error);
    return { success: false, error: 'Không thể tạo phiếu phạt' };
  }
}

export async function updatePenalty(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Penalty>> {
  try {
    const existing = await prisma.penalty.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu phạt' };
    }

    // Không cho phép cập nhật nếu đã thanh toán
    if (existing.status === 'paid') {
      return { success: false, error: 'Không thể cập nhật phiếu phạt đã thanh toán' };
    }

    if (data.date) {
      data.date = new Date(data.date as string);
    }

    const penalty = await prisma.penalty.update({
      where: { systemId },
      data: data as Parameters<typeof prisma.penalty.update>[0]['data'],
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to update penalty:', error);
    return { success: false, error: 'Không thể cập nhật phiếu phạt' };
  }
}

export async function deletePenalty(
  systemId: string
): Promise<ActionResult<Penalty>> {
  try {
    const existing = await prisma.penalty.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu phạt' };
    }

    // Không cho phép xóa nếu đã thanh toán hoặc đã tính vào bảng lương
    if (existing.status === 'paid' || existing.status === 'Đã thanh toán') {
      return { success: false, error: 'Không thể xóa phiếu phạt đã thanh toán' };
    }
    if (existing.deductedInPayrollId) {
      return { success: false, error: 'Không thể xóa phiếu phạt đã tính vào bảng lương' };
    }

    // Hard delete since model doesn't have soft delete
    const penalty = await prisma.penalty.delete({
      where: { systemId },
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to delete penalty:', error);
    return { success: false, error: 'Không thể xóa phiếu phạt' };
  }
}

export async function restorePenalty(
  systemId: string
): Promise<ActionResult<Penalty>> {
  try {
    // Model doesn't support soft delete, so restore by changing status back to pending
    const penalty = await prisma.penalty.update({
      where: { systemId },
      data: { status: 'Chưa thanh toán' },
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to restore penalty:', error);
    return { success: false, error: 'Không thể khôi phục phiếu phạt' };
  }
}

export async function markPenaltyPaid(
  systemId: string
): Promise<ActionResult<Penalty>> {
  try {
    const existing = await prisma.penalty.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu phạt' };
    }

    if (existing.status === 'paid') {
      return { success: false, error: 'Phiếu phạt đã được thanh toán' };
    }

    const penalty = await prisma.penalty.update({
      where: { systemId },
      data: { status: 'paid' },
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to mark penalty as paid:', error);
    return { success: false, error: 'Không thể đánh dấu đã thanh toán' };
  }
}

export async function cancelPenalty(
  systemId: string,
  reason?: string
): Promise<ActionResult<Penalty>> {
  try {
    const existing = await prisma.penalty.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu phạt' };
    }

    if (existing.status === 'paid' || existing.status === 'Đã thanh toán') {
      return { success: false, error: 'Không thể hủy phiếu phạt đã thanh toán' };
    }
    if (existing.deductedInPayrollId) {
      return { success: false, error: 'Không thể hủy phiếu phạt đã tính vào bảng lương' };
    }

    const updateData: Record<string, unknown> = { status: 'Đã hủy' };
    if (reason) {
      updateData.reason = `${existing.reason || ''} [Lý do hủy: ${reason}]`;
    }

    const penalty = await prisma.penalty.update({
      where: { systemId },
      data: updateData as Parameters<typeof prisma.penalty.update>[0]['data'],
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: serializePenalty(penalty) };
  } catch (error) {
    console.error('Failed to cancel penalty:', error);
    return { success: false, error: 'Không thể hủy phiếu phạt' };
  }
}

export async function getPenaltiesByEmployee(
  employeeId: string,
  options: { status?: string; startDate?: Date; endDate?: Date } = {}
): Promise<ActionResult<Penalty[]>> {
  try {
    const where: Record<string, unknown> = { 
      employeeId,
    };
    if (options.status) where.status = options.status;
    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) (where.date as Record<string, unknown>).gte = options.startDate;
      if (options.endDate) (where.date as Record<string, unknown>).lte = options.endDate;
    }

    const penalties = await prisma.penalty.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return { success: true, data: penalties.map(serializePenalty) };
  } catch (error) {
    console.error('Failed to fetch penalties by employee:', error);
    return { success: false, error: 'Không thể tải danh sách phạt của nhân viên' };
  }
}

export async function bulkUpdatePenaltyStatus(
  systemIds: string[],
  status: 'pending' | 'paid' | 'cancelled'
): Promise<ActionResult<{ count: number }>> {
  try {
    const result = await prisma.penalty.updateMany({
      where: { 
        systemId: { in: systemIds },
        // Không cập nhật những cái đã paid hoặc đã liên kết payroll
        status: { notIn: ['paid', 'Đã thanh toán'] },
        deductedInPayrollId: null,
      },
      data: { status },
    });

    revalidatePath('/settings/penalties');
    revalidatePath('/employees');
    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error('Failed to bulk update penalty status:', error);
    return { success: false, error: 'Không thể cập nhật trạng thái hàng loạt' };
  }
}
