import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerGroup } from './types';
import { defaultCustomerGroups } from './customer-groups-data';

export const useCustomerGroupStore = createCrudStore<CustomerGroup>(
  defaultCustomerGroups, 'customer-groups',
  {
    persistKey: 'hrm-customer-groups',
  }
);
