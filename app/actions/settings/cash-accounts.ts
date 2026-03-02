'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateNextIds } from '@/lib/id-system';

type CashAccount = NonNullable<Awaited<ReturnType<typeof prisma.cashAccount.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CashAccountFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'CASH' | 'BANK';
  branchId?: string;
  isActive?: boolean;
}

export interface PaginatedCashAccounts {
  data: CashAccount[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getCashAccounts(
  filters: CashAccountFilters = {}
): Promise<ActionResult<PaginatedCashAccounts>> {
  try {
    const { page = 1, limit = 50, search, type, branchId, isActive } = filters;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { accountNumber: { contains: search, mode: 'insensitive' } },
        { bankName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (branchId) where.branchId = branchId;
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.cashAccount.findMany({
        where,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cashAccount.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch cash accounts:', error);
    return { success: false, error: 'Không thể tải danh sách tài khoản tiền' };
  }
}

export async function getCashAccountById(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  try {
    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
    });
    if (!account) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to fetch cash account:', error);
    return { success: false, error: 'Không thể tải thông tin tài khoản' };
  }
}

export async function createCashAccount(
  data: Record<string, unknown>
): Promise<ActionResult<CashAccount>> {
  try {
    const name = data.name as string;
    const type = data.type as 'CASH' | 'BANK';

    // Check unique name
    const existing = await prisma.cashAccount.findFirst({
      where: { name },
    });
    if (existing) {
      return { success: false, error: 'Tên tài khoản đã tồn tại' };
    }

    const { systemId, businessId } = await generateNextIds('cash-accounts');

    // Handle default (per type)
    if (data.isDefault) {
      await prisma.cashAccount.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.cashAccount.create({
      data: {
        systemId,
        id: businessId,
        name,
        type,
        branchId: data.branchId as string | undefined,
        branchSystemId: data.branchSystemId as string | undefined,
        accountNumber: data.accountNumber as string | undefined,
        bankAccountNumber: data.bankAccountNumber as string | undefined,
        bankName: data.bankName as string | undefined,
        bankBranch: data.bankBranch as string | undefined,
        bankCode: data.bankCode as string | undefined,
        accountHolder: data.accountHolder as string | undefined,
        initialBalance: data.initialBalance as number | undefined,
        balance: (data.initialBalance as number) || 0,
        minBalance: data.minBalance as number | undefined,
        maxBalance: data.maxBalance as number | undefined,
        managedBy: data.managedBy as string | undefined,
        accountType: data.accountType as string | undefined,
        isDefault: (data.isDefault as boolean) ?? false,
        isActive: (data.isActive as boolean) ?? true,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/cash-accounts');
    revalidatePath('/finance');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to create cash account:', error);
    return { success: false, error: 'Không thể tạo tài khoản' };
  }
}

export async function updateCashAccount(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<CashAccount>> {
  try {
    const existing = await prisma.cashAccount.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.cashAccount.findFirst({
        where: {
          name: data.name as string,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên tài khoản đã tồn tại' };
      }
    }

    // Handle default
    if (data.isDefault && !existing.isDefault) {
      await prisma.cashAccount.updateMany({
        where: { type: existing.type, isDefault: true, NOT: { systemId } },
        data: { isDefault: false },
      });
    }

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        branchId: data.branchId as string | undefined,
        branchSystemId: data.branchSystemId as string | undefined,
        accountNumber: data.accountNumber as string | undefined,
        bankAccountNumber: data.bankAccountNumber as string | undefined,
        bankName: data.bankName as string | undefined,
        bankBranch: data.bankBranch as string | undefined,
        bankCode: data.bankCode as string | undefined,
        accountHolder: data.accountHolder as string | undefined,
        minBalance: data.minBalance as number | undefined,
        maxBalance: data.maxBalance as number | undefined,
        managedBy: data.managedBy as string | undefined,
        isDefault: data.isDefault as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/cash-accounts');
    revalidatePath('/finance');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to update cash account:', error);
    return { success: false, error: 'Không thể cập nhật tài khoản' };
  }
}

export async function deleteCashAccount(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  try {
    const existing = await prisma.cashAccount.findUnique({
      where: { systemId },
      include: { _count: { select: { cash_transactions: true } } },
    });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    // Check if has transactions
    if (existing._count.cash_transactions > 0) {
      // Soft delete by setting isActive = false
      const account = await prisma.cashAccount.update({
        where: { systemId },
        data: { isActive: false },
      });
      revalidatePath('/settings/cash-accounts');
      return { success: true, data: account };
    }

    const account = await prisma.cashAccount.delete({
      where: { systemId },
    });

    revalidatePath('/settings/cash-accounts');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to delete cash account:', error);
    return { success: false, error: 'Không thể xóa tài khoản' };
  }
}

export async function setDefaultCashAccount(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  try {
    const existing = await prisma.cashAccount.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    await prisma.$transaction([
      prisma.cashAccount.updateMany({
        where: { type: existing.type, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.cashAccount.update({
        where: { systemId },
        data: { isDefault: true },
      }),
    ]);

    const account = await prisma.cashAccount.findUnique({ where: { systemId } });
    if (!account) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    revalidatePath('/settings/cash-accounts');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to set default cash account:', error);
    return { success: false, error: 'Không thể đặt mặc định' };
  }
}

export async function toggleCashAccountActive(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  try {
    const existing = await prisma.cashAccount.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/cash-accounts');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to toggle cash account active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveCashAccounts(
  type?: 'CASH' | 'BANK'
): Promise<ActionResult<CashAccount[]>> {
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;

    const accounts = await prisma.cashAccount.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return { success: true, data: accounts };
  } catch (error) {
    console.error('Failed to fetch active cash accounts:', error);
    return { success: false, error: 'Không thể tải danh sách tài khoản' };
  }
}

export async function adjustCashAccountBalance(
  systemId: string,
  amount: number,
  reason: string
): Promise<ActionResult<CashAccount>> {
  try {
    const existing = await prisma.cashAccount.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tài khoản' };
    }

    const newBalance = Number(existing.balance) + amount;
    if (newBalance < 0) {
      return { success: false, error: 'Số dư không đủ để thực hiện điều chỉnh' };
    }

    // Create adjustment transaction
    const txIds = await generateNextIds('cashbook');
    await prisma.cashTransaction.create({
      data: {
        systemId: txIds.systemId,
        id: txIds.businessId,
        accountId: systemId,
        type: amount >= 0 ? 'INCOME' : 'EXPENSE',
        amount: Math.abs(amount),
        description: `Điều chỉnh số dư: ${reason}`,
      },
    });

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: { balance: newBalance },
    });

    revalidatePath('/settings/cash-accounts');
    revalidatePath('/finance');
    return { success: true, data: account };
  } catch (error) {
    console.error('Failed to adjust cash account balance:', error);
    return { success: false, error: 'Không thể điều chỉnh số dư' };
  }
}

export async function getCashAccountsSummary(): Promise<
  ActionResult<{ totalCash: number; totalBank: number; total: number }>
> {
  try {
    const accounts = await prisma.cashAccount.findMany({
      where: { isActive: true },
      select: { type: true, balance: true },
    });

    const summary = accounts.reduce(
      (acc, account) => {
        const balance = Number(account.balance);
        if (account.type === 'CASH') {
          acc.totalCash += balance;
        } else {
          acc.totalBank += balance;
        }
        acc.total += balance;
        return acc;
      },
      { totalCash: 0, totalBank: 0, total: 0 }
    );

    return { success: true, data: summary };
  } catch (error) {
    console.error('Failed to get cash accounts summary:', error);
    return { success: false, error: 'Không thể tải tổng hợp tài khoản' };
  }
}
