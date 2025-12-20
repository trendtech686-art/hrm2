import { createCrudStore } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { ReceiptType } from './types';
import { toISODate, getCurrentDate } from '../../../lib/date-utils';

const baseStore = createCrudStore<ReceiptType>(initialData, 'receipt-types', {
  businessIdField: 'id',
  persistKey: 'hrm-receipt-types',
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
