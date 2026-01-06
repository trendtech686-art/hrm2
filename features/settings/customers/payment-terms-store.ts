import { createCrudStore } from '../../../lib/store-factory';
import type { PaymentTerm } from './types';

export const usePaymentTermStore = createCrudStore<PaymentTerm>(
  [], 'payment-terms',
  {}
);
