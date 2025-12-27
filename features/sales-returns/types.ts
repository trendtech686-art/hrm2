// Re-export sales return types from central prisma-extended
// Also re-export LineItem from orders for backward compatibility
export type { LineItem } from '../orders/types';

export type {
  ReturnLineItem,
  SalesReturnPayment,
  SalesReturn,
} from '@/lib/types/prisma-extended';
