/**
 * Shared serialization for warranty Decimal fields
 */
import type { Prisma } from '@/generated/prisma/client'

export function serializeWarranty<T extends {
  partsCost?: Prisma.Decimal | number | null;
  laborCost?: Prisma.Decimal | number | null;
  totalCost?: Prisma.Decimal | number | null;
  shippingFee?: Prisma.Decimal | number | null;
}>(warranty: T) {
  return {
    ...warranty,
    partsCost: warranty.partsCost !== null && warranty.partsCost !== undefined ? Number(warranty.partsCost) : 0,
    laborCost: warranty.laborCost !== null && warranty.laborCost !== undefined ? Number(warranty.laborCost) : 0,
    totalCost: warranty.totalCost !== null && warranty.totalCost !== undefined ? Number(warranty.totalCost) : 0,
    shippingFee: warranty.shippingFee !== null && warranty.shippingFee !== undefined ? Number(warranty.shippingFee) : 0,
  }
}
