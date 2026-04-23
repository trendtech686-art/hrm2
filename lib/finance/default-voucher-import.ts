import { prisma } from '@/lib/prisma'

/** Client trong callback `$transaction` */
export type PrismaTx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

/**
 * PTTK / quỹ mặc định dùng khi import tạo phiếu thu—chi từ batch (Sapo, Excel…)
 * — ưu tiên bản ghi isDefault trên tài khoản/branch khớp, sau đó fallback.
 */
export async function getDefaultPaymentMethodForVoucher(tx: PrismaTx) {
  return (
    (await tx.paymentMethod.findFirst({
      where: { isActive: true, isDefault: true },
      orderBy: { name: 'asc' },
    })) ||
    (await tx.paymentMethod.findFirst({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    }))
  )
}

/** Cột import có tên PTTK: khớp tên trong hệ thống; không khớp → PTTK mặc định (isDefault / fallback). */
export async function resolvePaymentMethodForVoucherImport(
  tx: PrismaTx,
  methodNameFromFile?: string | null,
) {
  const t = methodNameFromFile?.trim()
  if (t) {
    const byName = await tx.paymentMethod.findFirst({
      where: { isActive: true, name: { equals: t, mode: 'insensitive' } },
    })
    if (byName) return byName
  }
  const d = await getDefaultPaymentMethodForVoucher(tx)
  if (!d) {
    throw new Error('Không có phương thức thanh toán. Thêm PTTK trong Cài đặt > Thanh toán.')
  }
  return d
}

export async function getDefaultCashAccountForVoucher(
  tx: PrismaTx,
  branchSystemId: string,
) {
  return (
    (await tx.cashAccount.findFirst({
      where: { isActive: true, isDefault: true, branchSystemId },
    })) ||
    (await tx.cashAccount.findFirst({
      where: { isActive: true, branchSystemId },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    })) ||
    (await tx.cashAccount.findFirst({
      where: { isActive: true, isDefault: true, branchSystemId: null },
    })) ||
    (await tx.cashAccount.findFirst({
      where: { isActive: true, isDefault: true },
    })) ||
    (await tx.cashAccount.findFirst({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    }))
  )
}
