import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getUserNameFromDb } from '@/lib/get-user-name'

// GET /api/cash-accounts/[systemId]?transactionsLimit=20
export const GET = apiHandler(async (request, { params }) => {
  try {
    const { systemId } = params
    const url = new URL(request.url)
    const transactionsLimit = Math.min(10000, Math.max(1, parseInt(url.searchParams.get('transactionsLimit') || '20', 10)))

    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
      include: {
        cash_transactions: {
          take: transactionsLimit,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!account) {
      return apiNotFound('Quỹ tiền')
    }

    // Map to frontend format
    return apiSuccess({
      ...account,
      type: account.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: account.branchId, // Map DB field to frontend field
      initialBalance: Number(account.initialBalance) || 0,
      balance: Number(account.balance) || 0,
      minBalance: account.minBalance ? Number(account.minBalance) : undefined,
      maxBalance: account.maxBalance ? Number(account.maxBalance) : undefined,
    })
  } catch (error) {
    logError('Error fetching cash account', error)
    return apiError('Không thể tải thông tin quỹ tiền', 500)
  }
})

// PUT /api/cash-accounts/[systemId]
export const PUT = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params
    const body = await request.json()

    const existing = await prisma.cashAccount.findUnique({ where: { systemId } })
    if (!existing) return apiNotFound('Quỹ tiền')

    const typeUpper = body.type?.toUpperCase();
    const cashType = (typeUpper === 'BANK' ? 'BANK' : typeUpper === 'WALLET' ? 'WALLET' : 'CASH') as import('@/generated/prisma/client').CashAccountType

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        type: cashType,
        bankName: body.bankName,
        bankAccountNumber: body.bankAccountNumber,
        bankBranch: body.bankBranch,
        bankCode: body.bankCode,
        accountHolder: body.accountHolder,
        branchId: body.branchSystemId,
        minBalance: body.minBalance,
        maxBalance: body.maxBalance,
        accountType: body.accountType,
        isActive: body.isActive,
        isDefault: body.isDefault,
      },
    })

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.type !== undefined && body.type?.toUpperCase() !== existing.type) changes['Loại'] = { from: existing.type, to: cashType }
    if (body.bankName !== undefined && body.bankName !== existing.bankName) changes['Ngân hàng'] = { from: existing.bankName, to: body.bankName }
    if (body.bankAccountNumber !== undefined && body.bankAccountNumber !== existing.bankAccountNumber) changes['Số TK'] = { from: existing.bankAccountNumber, to: body.bankAccountNumber }
    if (body.accountHolder !== undefined && body.accountHolder !== existing.accountHolder) changes['Chủ TK'] = { from: existing.accountHolder, to: body.accountHolder }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      getUserNameFromDb(session!.user.id).then(userName =>
        createActivityLog({
          entityType: 'cash_account',
          entityId: systemId,
          action: `Cập nhật tài khoản quỹ: ${existing.name}: ${changeDetail}`,
          actionType: 'update',
          changes,
          createdBy: userName,
        })
      ).catch(e => logError('Failed to create activity log', e))
    }

    // Map to frontend format
    return apiSuccess({
      ...account,
      type: account.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: account.branchId, // Map DB field to frontend field
      initialBalance: Number(account.initialBalance) || 0,
      balance: Number(account.balance) || 0,
      minBalance: account.minBalance ? Number(account.minBalance) : undefined,
      maxBalance: account.maxBalance ? Number(account.maxBalance) : undefined,
    })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Quỹ tiền')
    }
    logError('Error updating cash account', error)
    return apiError('Không thể cập nhật quỹ tiền', 500)
  }
})

// PATCH /api/cash-accounts/[systemId] - same as PUT
export { PUT as PATCH }

// DELETE /api/cash-accounts/[systemId]
export const DELETE = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    // Check if account exists
    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
    })

    if (!account) {
      return apiNotFound('Quỹ tiền')
    }

    // Check if account has transactions
    const transactionCount = await prisma.cashTransaction.count({
      where: { accountId: systemId },
    })

    if (transactionCount > 0) {
      return apiError('Không thể xóa quỹ tiền có giao dịch. Vui lòng tắt trạng thái thay vì xóa.', 400)
    }

    // Delete the account
    await prisma.cashAccount.delete({
      where: { systemId },
    })

    getUserNameFromDb(session!.user.id).then(userName =>
      createActivityLog({
        entityType: 'cash_account',
        entityId: systemId,
        action: `Xóa tài khoản quỹ: ${account.name}`,
        actionType: 'delete',
        createdBy: userName,
      })
    ).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Quỹ tiền')
    }
    logError('Error deleting cash account', error)
    return apiError('Không thể xóa quỹ tiền', 500)
  }
})
