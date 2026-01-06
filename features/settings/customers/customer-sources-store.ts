import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerSource } from './types';

export const useCustomerSourceStore = createCrudStore<CustomerSource>(
  [], 'customer-sources',
  {}
);
