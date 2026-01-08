/**
 * @deprecated Use React Query hooks instead:
 * - `useReceiptTypes()` for list
 * - `useReceiptTypeById(id)` for single
 * - `useReceiptTypeMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/receipt-types/hooks/use-receipt-types`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore } from '../../../lib/store-factory';
import type { ReceiptType } from '@/lib/types/prisma-extended';
import { toISODate, getCurrentDate } from '../../../lib/date-utils';

const baseStore = createCrudStore<ReceiptType>([], 'receipt-types', {
  businessIdField: 'id',
});

const originalAdd = baseStore.getState().add;

baseStore.setState((state) => ({
  ...state,
  add: (item) => {
    const newItem = {
      ...item,
      createdAt: item.createdAt ?? toISODate(getCurrentDate()),
    } satisfies Omit<ReceiptType, 'systemId'>;
    return originalAdd(newItem);
  },
}));

export const useReceiptTypeStore = baseStore;
