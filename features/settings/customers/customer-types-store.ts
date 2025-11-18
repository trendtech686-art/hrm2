import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerType } from './types';
import { defaultCustomerTypes } from './customer-types-data';

export const useCustomerTypeStore = createCrudStore<CustomerType>(
  defaultCustomerTypes, 'customer-types',
  {
    persistKey: 'hrm-customer-types',
  }
);
