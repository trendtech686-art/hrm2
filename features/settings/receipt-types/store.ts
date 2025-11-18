import { createCrudStore } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { ReceiptType } from './types.ts';
import { toISODate, getCurrentDate } from '../../../lib/date-utils';

const baseStore = createCrudStore(initialData as any, 'receipt-types', {
  persistKey: 'hrm-receipt-types'
});

const originalAdd = baseStore.getState().add;

baseStore.setState({
  add: (item) => {
    const newItem = {
      ...item,
      createdAt: toISODate(getCurrentDate()),
    } as Omit<ReceiptType, 'systemId'>;
    return originalAdd(newItem);
  },
});

export const useReceiptTypeStore = baseStore;
