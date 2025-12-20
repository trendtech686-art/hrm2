import { createCrudStore } from '../../../../lib/store-factory';
import { data as initialData } from './data';
import type { PaymentType } from './types';
import { toISODate, getCurrentDate } from '../../../../lib/date-utils';

const baseStore = createCrudStore<PaymentType>(initialData, 'payment-types', {
  businessIdField: 'id',
  persistKey: 'hrm-payment-types',
});

const originalAdd = baseStore.getState().add;

baseStore.setState((state) => ({
  ...state,
  add: (item) => {
    const newItem = {
      ...item,
      createdAt: item.createdAt ?? toISODate(getCurrentDate()),
    } satisfies Omit<PaymentType, 'systemId'>;
    return originalAdd(newItem);
  },
}));

export const usePaymentTypeStore = baseStore;
