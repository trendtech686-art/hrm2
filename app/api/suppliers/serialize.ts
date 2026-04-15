import type { Prisma } from '@/generated/prisma/client'

/**
 * Serialize Supplier Decimal fields to numbers for JSON response.
 *
 * Shared between supplier detail ([systemId]/route.ts), list (route.ts),
 * and deleted suppliers (deleted/route.ts).
 */
export function serializeSupplier<T extends {
  totalPurchased?: Prisma.Decimal | number | null;
  totalDebt?: Prisma.Decimal | number | null;
  currentDebt?: Prisma.Decimal | number | null;
  purchaseOrders?: { subtotal?: Prisma.Decimal | number | null; discount?: Prisma.Decimal | number | null; tax?: Prisma.Decimal | number | null; total?: Prisma.Decimal | number | null; paid?: Prisma.Decimal | number | null; debt?: Prisma.Decimal | number | null }[];
}>(supplier: T) {
  return {
    ...supplier,
    totalPurchased: supplier.totalPurchased != null ? Number(supplier.totalPurchased) : 0,
    totalDebt: supplier.totalDebt != null ? Number(supplier.totalDebt) : 0,
    currentDebt: supplier.currentDebt != null ? Number(supplier.currentDebt) : null,
    purchaseOrders: supplier.purchaseOrders?.map(po => ({
      ...po,
      subtotal: po.subtotal != null ? Number(po.subtotal) : 0,
      discount: po.discount != null ? Number(po.discount) : 0,
      tax: po.tax != null ? Number(po.tax) : 0,
      total: po.total != null ? Number(po.total) : 0,
      paid: po.paid != null ? Number(po.paid) : 0,
      debt: po.debt != null ? Number(po.debt) : 0,
    })),
  };
}
