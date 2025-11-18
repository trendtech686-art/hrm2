import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerSource } from './types';
import { defaultCustomerSources } from './customer-sources-data';

export const useCustomerSourceStore = createCrudStore<CustomerSource>(
  defaultCustomerSources, 'customer-sources',
  {
    persistKey: 'hrm-customer-sources',
  }
);
