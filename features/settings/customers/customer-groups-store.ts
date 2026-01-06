import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerGroup } from './types';

export const useCustomerGroupStore = createCrudStore<CustomerGroup>(
  [], 'customer-groups',
  {}
);
