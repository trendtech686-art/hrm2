import { createCrudStore } from '../../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { PaymentType } from './types.ts';
import { toISODate, getCurrentDate } from '../../../../lib/date-utils';

const baseStore = createCrudStore(initialData as any, 'payment-types') as any;
const originalAdd = baseStore.getState().add;

baseStore.setState({
  add: (item) => {
    const newItem = {
      ...item,
      createdAt: toISODate(getCurrentDate()),
    } as Omit<PaymentType, 'systemId'>;
    return originalAdd(newItem);
  },
});

export const usePaymentTypeStore = baseStore;
