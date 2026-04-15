/**
 * Shared serialization for receipt Decimal fields
 */
import type { Prisma } from '@/generated/prisma/client'

export function serializeReceipt<T extends {
  amount?: Prisma.Decimal | number | null;
  runningBalance?: Prisma.Decimal | number | null;
}>(receipt: T) {
  return {
    ...receipt,
    amount: receipt.amount !== null && receipt.amount !== undefined ? Number(receipt.amount) : 0,
    runningBalance: receipt.runningBalance !== null && receipt.runningBalance !== undefined ? Number(receipt.runningBalance) : null,
  }
}
