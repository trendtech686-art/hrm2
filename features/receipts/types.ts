// Re-export all receipt types from central prisma-extended
export type {
  ReceiptType,
  ReceiptStatus,
  ReceiptCategory,
  ReceiptOrderAllocation,
  Receipt,
} from '@/lib/types/prisma-extended';

export {
  RECEIPT_STATUS_LABELS,
  RECEIPT_CATEGORY_LABELS,
} from '@/lib/types/prisma-extended';
