import { createCrudStore } from '../../../lib/store-factory';
import type { PaymentTerm } from './types';
import { defaultPaymentTerms } from './payment-terms-data';

export const usePaymentTermStore = createCrudStore<PaymentTerm>(
  defaultPaymentTerms, 'payment-terms',
  {
    persistKey: 'hrm-payment-terms',
  }
);
