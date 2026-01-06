import { createCrudStore } from '../../../../lib/store-factory';
import type { PaymentType } from '@/lib/types/prisma-extended';
import { toISODate, getCurrentDate } from '../../../../lib/date-utils';

const baseStore = createCrudStore<PaymentType>([], 'payment-types', {
  businessIdField: 'id',
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
