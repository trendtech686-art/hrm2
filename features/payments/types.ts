// Re-export all payment types from central prisma-extended
export type {
  PaymentType,
  PaymentStatus,
  PaymentCategory,
  Payment,
} from '@/lib/types/prisma-extended';

export {
  PAYMENT_STATUS_LABELS,
  PAYMENT_CATEGORY_LABELS,
} from '@/lib/types/prisma-extended';
