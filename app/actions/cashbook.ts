'use server'

/**
 * Server Actions for Cashbook Management (Sổ quỹ)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createCashAccountSchema, updateCashAccountSchema } from '@/features/cashbook/validation'

// Types
type CashAccount = NonNullable<Awaited<ReturnType<typeof prisma.cashAccount.findFirst>>>

export type CreateCashAccountInput = {
  name: string
  type: string
  branchId?: string
  branchSystemId?: string
  accountNumber?: string
  bankName?: string
  bankAccountNumber?: string
  bankBranch?: string
  bankCode?: string
  accountHolder?: string
  initialBalance?: number
  minBalance?: number
  maxBalance?: number
  isActive?: boolean
  isDefault?: boolean
  managedBy?: string
  createdBy?: string
}

export type UpdateCashAccountInput = {
  systemId: string
  name?: string
  type?: string
  branchId?: string
  branchSystemId?: string
  accountNumber?: string
  bankName?: string
  bankAccountNumber?: string
  bankBranch?: string
  bankCode?: string
  accountHolder?: string
  balance?: number
  initialBalance?: number
  minBalance?: number
  maxBalance?: number
  isActive?: boolean
  isDefault?: boolean
  managedBy?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createCashAccountAction(
  input: CreateCashAccountInput
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createCashAccountSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('TK', prisma)

    const cashAccount = await prisma.cashAccount.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        type: input.type as CashAccount['type'],
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        accountNumber: input.accountNumber,
        bankName: input.bankName,
        bankAccountNumber: input.bankAccountNumber,
        bankBranch: input.bankBranch,
        bankCode: input.bankCode,
        accountHolder: input.accountHolder,
        balance: input.initialBalance ?? 0,
        initialBalance: input.initialBalance ?? 0,
        minBalance: input.minBalance,
        maxBalance: input.maxBalance,
        isActive: input.isActive ?? true,
        isDefault: input.isDefault ?? false,
        managedBy: input.managedBy,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/cashbook')
    revalidatePath('/cash-accounts')
    return { success: true, data: cashAccount }
  } catch (error) {
    console.error('Error creating cash account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo giao dịch sổ quỹ',
    }
  }
}

export async function updateCashAccountAction(
  input: UpdateCashAccountInput
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updateCashAccountSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.cashAccount.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy giao dịch sổ quỹ' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.type !== undefined) updateData.type = data.type
    if (data.branchId !== undefined) updateData.branchId = data.branchId
    if (data.branchSystemId !== undefined) updateData.branchSystemId = data.branchSystemId
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber
    if (data.bankName !== undefined) updateData.bankName = data.bankName
    if (data.bankAccountNumber !== undefined) updateData.bankAccountNumber = data.bankAccountNumber
    if (data.bankBranch !== undefined) updateData.bankBranch = data.bankBranch
    if (data.bankCode !== undefined) updateData.bankCode = data.bankCode
    if (data.accountHolder !== undefined) updateData.accountHolder = data.accountHolder
    if (data.balance !== undefined) updateData.balance = data.balance
    if (data.initialBalance !== undefined) updateData.initialBalance = data.initialBalance
    if (data.minBalance !== undefined) updateData.minBalance = data.minBalance
    if (data.maxBalance !== undefined) updateData.maxBalance = data.maxBalance
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.managedBy !== undefined) updateData.managedBy = data.managedBy
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const cashAccount = await prisma.cashAccount.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/cashbook')
    revalidatePath('/cash-accounts')
    revalidatePath(`/cash-accounts/${systemId}`)
    return { success: true, data: cashAccount }
  } catch (error) {
    console.error('Error updating cash account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật giao dịch sổ quỹ',
    }
  }
}

export async function deleteCashAccountAction(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.cashAccount.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy giao dịch sổ quỹ' }
    }

    // Don't allow deleting default account
    if (existing.isDefault) {
      return {
        success: false,
        error: 'Không thể xóa tài khoản quỹ mặc định',
      }
    }

    const cashAccount = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        isActive: false,
      },
    })

    revalidatePath('/cashbook')
    revalidatePath('/cash-accounts')
    return { success: true, data: cashAccount }
  } catch (error) {
    console.error('Error deleting cash account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa giao dịch sổ quỹ',
    }
  }
}

export async function getCashAccountAction(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const cashAccount = await prisma.cashAccount.findUnique({
      where: { systemId },
    })

    if (!cashAccount) {
      return { success: false, error: 'Không tìm thấy giao dịch sổ quỹ' }
    }

    return { success: true, data: cashAccount }
  } catch (error) {
    console.error('Error getting cash account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin sổ quỹ',
    }
  }
}

export async function updateCashAccountBalanceAction(
  systemId: string,
  amount: number,
  operation: 'add' | 'subtract'
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const cashAccount = await prisma.cashAccount.findUnique({
      where: { systemId },
    })

    if (!cashAccount) {
      return { success: false, error: 'Không tìm thấy giao dịch sổ quỹ' }
    }

    const currentBalance = Number(cashAccount.balance ?? 0)
    const newBalance = operation === 'add' 
      ? currentBalance + amount 
      : currentBalance - amount

    if (newBalance < 0) {
      return {
        success: false,
        error: 'Số dư không đủ',
      }
    }

    const updated = await prisma.cashAccount.update({
      where: { systemId },
      data: { balance: newBalance },
    })

    revalidatePath('/cashbook')
    revalidatePath('/cash-accounts')
    revalidatePath(`/cash-accounts/${systemId}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating cash account balance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật số dư sổ quỹ',
    }
  }
}

export async function setDefaultCashAccountAction(
  systemId: string
): Promise<ActionResult<CashAccount>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    // Remove default from all other accounts
    await prisma.cashAccount.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })

    // Set this account as default
    const cashAccount = await prisma.cashAccount.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/cashbook')
    revalidatePath('/cash-accounts')
    return { success: true, data: cashAccount }
  } catch (error) {
    console.error('Error setting default cash account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đặt tài khoản quỹ mặc định',
    }
  }
}
