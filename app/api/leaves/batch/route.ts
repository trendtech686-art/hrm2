/**
 * Leaves Batch API Route
 *
 * POST /api/leaves/batch — Execute batch operations on leave requests
 *
 * Supported actions:
 *   - approve: Batch approve multiple leaves
 *   - reject:  Batch reject multiple leaves
 *   - create:  Batch create multiple leave requests (import)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LeaveStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { z } from 'zod';

// --- Schemas ---

const batchApproveSchema = z.object({
  action: z.literal('approve'),
  systemIds: z.array(z.string()).min(1, 'Cần ít nhất 1 đơn'),
  approvedBy: z.string().min(1, 'Tên người duyệt là bắt buộc'),
});

const batchRejectSchema = z.object({
  action: z.literal('reject'),
  systemIds: z.array(z.string()).min(1, 'Cần ít nhất 1 đơn'),
  rejectedBy: z.string().min(1, 'Tên người từ chối là bắt buộc'),
  reason: z.string().optional(),
});

const batchCreateItemSchema = z.object({
  employeeId: z.string().min(1),
  leaveType: z.string().optional().default('ANNUAL'),
  leaveTypeName: z.string().optional(),
  leaveTypeSystemId: z.string().optional(),
  leaveTypeId: z.string().optional(),
  leaveTypeIsPaid: z.boolean().optional().default(true),
  leaveTypeRequiresAttachment: z.boolean().optional().default(false),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number().optional(),
  numberOfDays: z.number().optional(),
  reason: z.string().optional(),
  status: z.string().optional().default('PENDING'),
});

const batchCreateSchema = z.object({
  action: z.literal('create'),
  items: z.array(batchCreateItemSchema).min(1, 'Cần ít nhất 1 đơn'),
});

const batchSchema = z.discriminatedUnion('action', [
  batchApproveSchema,
  batchRejectSchema,
  batchCreateSchema,
]);

// Status mapping from Vietnamese to enum
const statusMap: Record<string, string> = {
  'Chờ duyệt': 'PENDING',
  'Đã duyệt': 'APPROVED',
  'Đã từ chối': 'REJECTED',
  'Đã hủy': 'CANCELLED',
};

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const parsed = batchSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid request', 400);
    }

    const data = parsed.data;

    // --- BATCH APPROVE ---
    if (data.action === 'approve') {
      // Find all PENDING leaves in one query
      const leaves = await prisma.leave.findMany({
        where: {
          systemId: { in: data.systemIds },
          status: 'PENDING' as LeaveStatus,
        },
        include: { employee: true },
      });

      if (leaves.length === 0) {
        return apiSuccess({ approved: 0, skipped: data.systemIds.length, errors: [] });
      }

      const errors: string[] = [];
      let approved = 0;

      // Process in a transaction for consistency
      await prisma.$transaction(async (tx) => {
        for (const leave of leaves) {
          try {
            // Deduct annual leave balance if applicable
            if (leave.leaveType === 'ANNUAL' && leave.employee) {
              const currentBalance = leave.employee.annualLeaveBalance ?? 0;
              const daysToDeduct = Number(leave.totalDays ?? leave.numberOfDays ?? 0);

              if (currentBalance < daysToDeduct) {
                errors.push(`${leave.systemId}: Không đủ ngày phép (cần ${daysToDeduct}, còn ${currentBalance})`);
                return; // skip this leave
              }

              await tx.employee.update({
                where: { systemId: leave.employeeId! },
                data: { annualLeaveBalance: currentBalance - daysToDeduct },
              });
            }

            await tx.leave.update({
              where: { systemId: leave.systemId },
              data: {
                status: 'APPROVED' as LeaveStatus,
                approvedBy: data.approvedBy,
                approvedAt: new Date(),
              },
            });
            approved++;
          } catch (err) {
            errors.push(`${leave.systemId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      });

      const skipped = data.systemIds.length - approved - errors.length;
      return apiSuccess({ approved, skipped, errors });
    }

    // --- BATCH REJECT ---
    if (data.action === 'reject') {
      const result = await prisma.leave.updateMany({
        where: {
          systemId: { in: data.systemIds },
          status: 'PENDING' as LeaveStatus,
        },
        data: {
          status: 'REJECTED' as LeaveStatus,
          rejectedBy: data.rejectedBy,
          rejectedAt: new Date(),
          rejectionReason: data.reason || undefined,
        },
      });

      return apiSuccess({
        rejected: result.count,
        skipped: data.systemIds.length - result.count,
      });
    }

    // --- BATCH CREATE ---
    if (data.action === 'create') {
      const created: string[] = [];
      const errors: string[] = [];

      await prisma.$transaction(async (tx) => {
        for (const item of data.items) {
          try {
            const systemId = await generateIdWithPrefix('NP', prisma);
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            const mappedStatus = statusMap[item.status] || item.status;

            await tx.leave.create({
              data: {
                systemId,
                id: systemId,
                employeeId: item.employeeId,
                leaveType: item.leaveType as 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER',
                leaveTypeName: item.leaveTypeName,
                leaveTypeSystemId: item.leaveTypeSystemId,
                leaveTypeId: item.leaveTypeId,
                leaveTypeIsPaid: item.leaveTypeIsPaid ?? true,
                leaveTypeRequiresAttachment: item.leaveTypeRequiresAttachment ?? false,
                startDate,
                endDate,
                totalDays: item.totalDays ?? diffDays,
                numberOfDays: item.numberOfDays ?? diffDays,
                reason: item.reason,
                status: mappedStatus as LeaveStatus,
                requestDate: new Date(),
              },
            });
            created.push(systemId);
          } catch (err) {
            errors.push(`Row ${data.items.indexOf(item) + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      });

      return apiSuccess({ created: created.length, errors });
    }

    return apiError('Unknown action', 400);
  } catch (error) {
    console.error('[Leaves Batch API] POST error:', error);
    return apiError('Failed to process batch operation', 500);
  }
}
