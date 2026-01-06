import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerType } from './types';

export const useCustomerTypeStore = createCrudStore<CustomerType>(
  [], 'customer-types',
  {}
);
