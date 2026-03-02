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

import type { Receipt } from '@/lib/types/prisma-extended';
import type { BusinessId } from '@/lib/id-types';

export type ReceiptInput = Omit<Receipt, 'systemId' | 'id'> & { id?: BusinessId };
