/**
 * Chọn tài khoản quỹ mặc định cho phiếu thu/chi (dùng khi luồng tự động chưa truyền TK).
 * Nguồn duy nhất: bảng cash_accounts (Prisma CashAccount).
 */
import { prisma } from '@/lib/prisma'
import type { CashAccountType, Prisma } from '@/generated/prisma/client'

function normalizeMethodType(raw: string | null | undefined): CashAccountType | undefined {
  const u = raw?.trim().toUpperCase()
  if (u === 'CASH' || u === 'BANK' || u === 'WALLET') return u
  return undefined
}

function baseWhere(
  branchSystemId: string | null | undefined,
  type: CashAccountType | undefined
): Prisma.CashAccountWhereInput {
  const branchOrGlobal: Prisma.CashAccountWhereInput['OR'] = branchSystemId
    ? [
        { branchSystemId },
        { branchId: branchSystemId },
        { AND: [{ branchSystemId: null }, { branchId: null }] },
      ]
    : [{ AND: [{ branchSystemId: null }, { branchId: null }] }]

  return {
    isActive: true,
    ...(type ? { type } : {}),
    OR: branchOrGlobal,
  }
}

/**
 * Trả về systemId của 1 CashAccount phù hợp (ưu tiên default, khớp type hình thức nếu có).
 */
export async function resolveDefaultCashAccountSystemId(options: {
  branchId?: string | null
  paymentMethodType?: string | null
}): Promise<string | null> {
  const type = normalizeMethodType(options.paymentMethodType)
  const branchId = options.branchId

  const tryFind = async (withType: boolean) =>
    prisma.cashAccount.findMany({
      where: baseWhere(branchId, withType && type ? type : undefined),
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      take: 32,
      select: { systemId: true, isDefault: true },
    })

  let rows = await tryFind(true)

  if (rows.length === 0 && type) {
    rows = await tryFind(false)
  }

  if (rows.length === 0) {
    const any = await prisma.cashAccount.findFirst({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      select: { systemId: true },
    })
    return any?.systemId ?? null
  }

  const picked = rows.find((r) => r.isDefault) ?? rows[0]
  return picked.systemId
}
