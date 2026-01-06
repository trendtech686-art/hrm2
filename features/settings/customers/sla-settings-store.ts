import { createCrudStore } from '../../../lib/store-factory';
import type { CustomerSlaSetting, CustomerSlaType } from './types';

export const useCustomerSlaStore = createCrudStore<CustomerSlaSetting>(
  [], 'sla-settings',
  {}
);

// Helper function to get SLA by type (simplified - only 1 per type)
export function getSlaBySlaType(slaType: CustomerSlaType): CustomerSlaSetting | undefined {
  return useCustomerSlaStore.getState().data.find(
    (sla) => sla.slaType === slaType && sla.isActive
  );
}

// Helper to load all active SLA settings
export function loadCustomerSlaSettings() {
  return useCustomerSlaStore.getState().data.filter((sla) => sla.isActive);
}
