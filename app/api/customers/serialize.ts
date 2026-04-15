import type { Prisma } from '@/generated/prisma/client'

/**
 * Serialize Customer Decimal fields to numbers for JSON response.
 *
 * Shared between customer list (route.ts), detail ([systemId]/route.ts),
 * and deleted customers (deleted/route.ts).
 */
export function serializeCustomer<T extends {
  currentDebt?: Prisma.Decimal | number | null;
  maxDebt?: Prisma.Decimal | number | null;
  defaultDiscount?: Prisma.Decimal | number | null;
  totalSpent?: Prisma.Decimal | number | null;
}>(customer: T) {
  return {
    ...customer,
    currentDebt: customer.currentDebt != null ? Number(customer.currentDebt) : null,
    maxDebt: customer.maxDebt != null ? Number(customer.maxDebt) : null,
    defaultDiscount: customer.defaultDiscount != null ? Number(customer.defaultDiscount) : null,
    totalSpent: customer.totalSpent != null ? Number(customer.totalSpent) : null,
  };
}
