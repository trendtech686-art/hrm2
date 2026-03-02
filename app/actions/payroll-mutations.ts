'use server';

/**
 * Server Actions for Payroll Mutations
 * 
 * Schema:
 * - Payroll: systemId, id, year, month, branchId, status, totalEmployees, totalGross, totalDeductions, totalNet
 * - PayrollItem: systemId, payrollId, employeeId, employeeName, employeeCode, various salary fields
 * - Penalty: systemId, employeeId, amount, deductedAt, deductedInPayrollId, isApplied
 */

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============== Types ==============

export interface CreatePayrollInput {
  year: number;
  month: number;
  branchId?: string;
  items: CreatePayrollItemInput[];
}

export interface CreatePayrollItemInput {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  workDays: number;
  otHours?: number;
  leaveDays?: number;
  baseSalary: number;
  otPay?: number;
  allowances?: number;
  bonus?: number;
  grossSalary: number;
  socialInsurance?: number;
  healthInsurance?: number;
  unemploymentIns?: number;
  tax?: number;
  otherDeductions?: number;
  totalDeductions: number;
  netSalary: number;
  notes?: string;
  penaltyIds?: string[];
}

// ============== Create Payroll with Items ==============

export async function createPayrollWithItems(
  input: CreatePayrollInput
): Promise<ActionResult<{ payrollId: string; itemCount: number }>> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Generate payroll ID
      const payrollSystemId = await generateIdWithPrefix('PAY', tx);

      // Calculate totals
      const totalGross = input.items.reduce((sum, i) => sum + i.grossSalary, 0);
      const totalDeductions = input.items.reduce((sum, i) => sum + i.totalDeductions, 0);
      const totalNet = input.items.reduce((sum, i) => sum + i.netSalary, 0);

      // Create payroll
      const payroll = await tx.payroll.create({
        data: {
          systemId: payrollSystemId,
          id: payrollSystemId,
          year: input.year,
          month: input.month,
          branchId: input.branchId,
          status: 'DRAFT',
          totalEmployees: input.items.length,
          totalGross,
          totalDeductions,
          totalNet,
        },
      });

      // Create payroll items
      const items = await Promise.all(
        input.items.map(async (item) => {
          const itemSystemId = await generateIdWithPrefix('PAYI', tx);
          return tx.payrollItem.create({
            data: {
              systemId: itemSystemId,
              payrollId: payroll.systemId,
              employeeId: item.employeeId,
              employeeName: item.employeeName,
              employeeCode: item.employeeCode,
              workDays: item.workDays,
              otHours: item.otHours ?? 0,
              leaveDays: item.leaveDays ?? 0,
              baseSalary: item.baseSalary,
              otPay: item.otPay ?? 0,
              allowances: item.allowances ?? 0,
              bonus: item.bonus ?? 0,
              grossSalary: item.grossSalary,
              socialInsurance: item.socialInsurance ?? 0,
              healthInsurance: item.healthInsurance ?? 0,
              unemploymentIns: item.unemploymentIns ?? 0,
              tax: item.tax ?? 0,
              otherDeductions: item.otherDeductions ?? 0,
              totalDeductions: item.totalDeductions,
              netSalary: item.netSalary,
              notes: item.notes,
            },
          });
        })
      );

      // Mark penalties as applied
      const allPenaltyIds = input.items.flatMap((i) => i.penaltyIds || []);
      if (allPenaltyIds.length > 0) {
        await tx.penalty.updateMany({
          where: { systemId: { in: allPenaltyIds } },
          data: {
            isApplied: true,
            deductedAt: new Date(),
            deductedInPayrollId: payroll.systemId,
          },
        });
      }

      return { payroll, items };
    });

    revalidatePath('/payroll');
    return {
      success: true,
      data: {
        payrollId: result.payroll.systemId,
        itemCount: result.items.length,
      },
    };
  } catch (error) {
    console.error('Failed to create payroll:', error);
    return { success: false, error: 'Không thể tạo bảng lương' };
  }
}

// ============== Status Updates ==============

export interface UpdatePayrollStatusInput {
  systemId: string;
  status: 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  processedBy?: string;
}

export async function updatePayrollStatus(
  input: UpdatePayrollStatusInput
): Promise<ActionResult<{ payrollId: string; status: string }>> {
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId: input.systemId },
    });

    if (!existing) {
      return { success: false, error: 'Bảng lương không tồn tại' };
    }

    const updateData: Record<string, unknown> = {
      status: input.status,
    };

    if (input.status === 'COMPLETED') {
      updateData.processedAt = new Date();
      updateData.processedBy = input.processedBy;
    }

    await prisma.payroll.update({
      where: { systemId: input.systemId },
      data: updateData,
    });

    revalidatePath('/payroll');
    return {
      success: true,
      data: { payrollId: input.systemId, status: input.status },
    };
  } catch (error) {
    console.error('Failed to update payroll status:', error);
    return { success: false, error: 'Không thể cập nhật trạng thái bảng lương' };
  }
}

// ============== Delete Payroll ==============

export async function deletePayroll(systemId: string): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!existing) {
      return { success: false, error: 'Bảng lương không tồn tại' };
    }

    if (existing.status !== 'DRAFT') {
      return { success: false, error: 'Chỉ có thể xóa bảng lương ở trạng thái DRAFT' };
    }

    // Revert penalties
    await prisma.penalty.updateMany({
      where: { deductedInPayrollId: systemId },
      data: {
        isApplied: false,
        deductedAt: null,
        deductedInPayrollId: null,
      },
    });

    // Delete payroll (items cascade)
    await prisma.payroll.delete({
      where: { systemId },
    });

    revalidatePath('/payroll');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete payroll:', error);
    return { success: false, error: 'Không thể xóa bảng lương' };
  }
}

// ============== Mark as Paid ==============

export async function markPayrollAsPaid(
  systemId: string,
  paidBy: string
): Promise<ActionResult<{ payrollId: string }>> {
  try {
    const existing = await prisma.payroll.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return { success: false, error: 'Bảng lương không tồn tại' };
    }

    if (existing.status !== 'COMPLETED') {
      return { success: false, error: 'Chỉ có thể thanh toán bảng lương đã hoàn thành' };
    }

    await prisma.payroll.update({
      where: { systemId },
      data: {
        paidAt: new Date(),
        paidBy,
      },
    });

    revalidatePath('/payroll');
    return { success: true, data: { payrollId: systemId } };
  } catch (error) {
    console.error('Failed to mark payroll as paid:', error);
    return { success: false, error: 'Không thể đánh dấu đã thanh toán' };
  }
}

// ============== Get Pending Penalties for Payroll ==============

export async function getPendingPenaltiesForPayroll(
  employeeIds: string[]
): Promise<ActionResult<Array<{ systemId: string; employeeId: string; amount: number }>>> {
  try {
    const penalties = await prisma.penalty.findMany({
      where: {
        employeeId: { in: employeeIds },
        isApplied: false,
        status: 'Chưa thanh toán',
      },
      select: {
        systemId: true,
        employeeId: true,
        amount: true,
      },
    });

    return {
      success: true,
      data: penalties.map((p) => ({
        systemId: p.systemId,
        employeeId: p.employeeId || '',
        amount: Number(p.amount),
      })),
    };
  } catch (error) {
    console.error('Failed to get pending penalties:', error);
    return { success: false, error: 'Không thể lấy danh sách phạt chưa thanh toán' };
  }
}
