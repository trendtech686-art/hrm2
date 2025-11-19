import type { SystemId } from '@/lib/id-types';
import type { UseBoundStore, StoreApi } from 'zustand';
import { data as initialData } from './data.ts';
import type { PricingPolicy } from './types.ts';
import { createCrudStore, type CrudState } from '../../../lib/store-factory.ts';
import { getCurrentUserSystemId } from '../../../contexts/auth-context.tsx';

type PricingPolicyStore = CrudState<PricingPolicy> & {
  setDefault: (systemId: SystemId) => void;
  getActive: () => PricingPolicy[];
  getInactive: () => PricingPolicy[];
};

const baseStore = createCrudStore<PricingPolicy>(initialData, 'pricing-settings', {
  businessIdField: 'id',
  persistKey: 'hrm-pricing-policy-storage',
  getCurrentUser: getCurrentUserSystemId,
}) as UseBoundStore<StoreApi<PricingPolicyStore>>;

const originalAdd = baseStore.getState().add;

const setDefaultAction = (systemId: SystemId) => {
  baseStore.setState((current) => {
    const target = current.data.find((policy) => policy.systemId === systemId);
    if (!target) return current;

    const updatedData = current.data.map((policy) => (
      policy.type === target.type
        ? { ...policy, isDefault: policy.systemId === systemId }
        : policy
    ));

    return { ...current, data: updatedData };
  });
};

const enhancedAdd: typeof originalAdd = (item) => {
  const newItem = originalAdd(item);
  const storeData = baseStore.getState().data;
  const hasDefaultForType = storeData
    .filter((policy) => policy.type === newItem.type)
    .some((policy) => policy.isDefault);

  if (item.isDefault) {
    setDefaultAction(newItem.systemId);
  } else if (!hasDefaultForType) {
    setDefaultAction(newItem.systemId);
  }

  return newItem;
};

baseStore.setState((state) => ({
  ...state,
  add: enhancedAdd,
  setDefault: setDefaultAction,
  getActive: () => baseStore.getState().data.filter((policy) => policy.isActive),
  getInactive: () => baseStore.getState().data.filter((policy) => !policy.isActive),
}));

export const usePricingPolicyStore = baseStore;
