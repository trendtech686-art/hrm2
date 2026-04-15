import { prisma } from '@/lib/prisma'
import { Prisma, CashAccountType } from '@/generated/prisma/client'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { createCashAccountSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getUserNameFromDb } from '@/lib/get-user-name'

// GET /api/cash-accounts - List all cash accounts
export const GET = apiHandler(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const _all = searchParams.get('all') === 'true'

    const where: Prisma.CashAccountWhereInput = {
      isActive: true,
    }

    const accounts = await prisma.cashAccount.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    // Map to frontend format
    const data = accounts.map(acc => ({
      ...acc,
      type: acc.type.toLowerCase() as 'cash' | 'bank',
      branchSystemId: acc.branchId, // Map DB field to frontend field
      initialBalance: Number(acc.initialBalance) || 0,
      balance: Number(acc.balance) || 0,
      minBalance: acc.minBalance ? Number(acc.minBalance) : undefined,
      maxBalance: acc.maxBalance ? Number(acc.maxBalance) : undefined,
    }))

    return apiSuccess({ data })
  } catch (error) {
    logError('Error fetching cash accounts', error)
    return apiError('Không thể tải danh sách quỹ tiền', 500)
  }
})

// POST /api/cash-accounts - Create new cash account
export const POST = apiHandler(async (request, { session }) => {
  const validation = await validateBody(request, createCashAccountSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const typeUpper = body.type?.toUpperCase();
    const cashType = (typeUpper === 'BANK' ? 'BANK' : typeUpper === 'WALLET' ? 'WALLET' : 'CASH') as CashAccountType;
    
    const { systemId, businessId } = await generateNextIds('cash-accounts')
    
    const account = await prisma.cashAccount.create({
      data: {
        systemId,
        id: body.id || businessId,
        name: body.name,
        type: cashType,
        balance: body.initialBalance ?? 0,
        initialBalance: body.initialBalance ?? 0,
        bankName: body.bankName,
        bankAccountNumber: body.bankAccountNumber,
        bankBranch: body.bankBranch,
        bankCode: body.bankCode,
        accountHolder: body.accountHolder,
        branchId: body.branchSystemId,
        minBalance: body.minBalance,
        maxBalance: body.maxBalance,
        accountType: body.accountType,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
      },
    })

    getUserNameFromDb(session!.user.id).then(userName =>
      createActivityLog({
        entityType: 'cash_account',
        entityId: account.systemId,
        action: `Thêm tài khoản quỹ: ${account.name}`,
        actionType: 'create',
        createdBy: userName,
      })
    ).catch(e => logError('activity log failed', e))

    return apiSuccess(account, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã quỹ đã tồn tại', 400)
    }
    logError('Error creating cash account', error)
    return apiError('Không thể tạo quỹ tiền', 500)
  }
})
