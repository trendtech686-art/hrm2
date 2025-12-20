import type { SystemId } from '@/lib/id-types';
import type { UseBoundStore, StoreApi } from 'zustand';
import { data as initialData } from './data';
import type { Tax } from './types';
import { createCrudStore, type CrudState } from '../../../lib/store-factory';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

type TaxStore = CrudState<Tax> & {
  setDefaultSale: (systemId: SystemId) => void;
  setDefaultPurchase: (systemId: SystemId) => void;
  getDefaultSale: () => Tax | undefined;
  getDefaultPurchase: () => Tax | undefined;
};

const baseStore = createCrudStore<Tax>(initialData, 'taxes', {
  businessIdField: 'id',
  persistKey: 'hrm-taxes-storage',
  getCurrentUser: getCurrentUserSystemId,
}) as UseBoundStore<StoreApi<TaxStore>>;

const originalAdd = baseStore.getState().add;

// Set default sale - chỉ có 1 mặc định (giống setDefault của PricingPolicy)
const setDefaultSaleAction = (systemId: SystemId) => {
  baseStore.setState((current) => {
    const exists = current.data.some((tax) => tax.systemId === systemId);
    if (!exists) return current;

    return {
      ...current,
      data: current.data.map((tax) => ({
        ...tax,
        isDefaultSale: tax.systemId === systemId,
      })),
    };
  });
};

// Set default purchase - chỉ có 1 mặc định
const setDefaultPurchaseAction = (systemId: SystemId) => {
  baseStore.setState((current) => {
    const exists = current.data.some((tax) => tax.systemId === systemId);
    if (!exists) return current;

    return {
      ...current,
      data: current.data.map((tax) => ({
        ...tax,
        isDefaultPurchase: tax.systemId === systemId,
      })),
    };
  });
};

const enhancedAdd: typeof originalAdd = (item) => {
  const newItem = originalAdd(item);
  const storeData = baseStore.getState().data;
  
  const hasDefaultSale = storeData.some((tax) => tax.isDefaultSale);
  const hasDefaultPurchase = storeData.some((tax) => tax.isDefaultPurchase);

  if (item.isDefaultSale) {
    setDefaultSaleAction(newItem.systemId);
  } else if (!hasDefaultSale) {
    setDefaultSaleAction(newItem.systemId);
  }

  if (item.isDefaultPurchase) {
    setDefaultPurchaseAction(newItem.systemId);
  } else if (!hasDefaultPurchase) {
    setDefaultPurchaseAction(newItem.systemId);
  }

  return newItem;
};

baseStore.setState((state) => ({
  ...state,
  add: enhancedAdd,
  setDefaultSale: setDefaultSaleAction,
  setDefaultPurchase: setDefaultPurchaseAction,
  getDefaultSale: () => baseStore.getState().data.find((tax) => tax.isDefaultSale),
  getDefaultPurchase: () => baseStore.getState().data.find((tax) => tax.isDefaultPurchase),
}));

// Ensure defaults exist on initial load (migrate old data without isDefaultSale/isDefaultPurchase)
const ensureDefaultsOnInit = () => {
  const currentData = baseStore.getState().data;
  if (currentData.length === 0) return;

  const hasDefaultSale = currentData.some((tax) => tax.isDefaultSale);
  const hasDefaultPurchase = currentData.some((tax) => tax.isDefaultPurchase);

  if (!hasDefaultSale || !hasDefaultPurchase) {
    baseStore.setState((current) => ({
      ...current,
      data: current.data.map((tax, index) => ({
        ...tax,
        isDefaultSale: !hasDefaultSale && index === 0 ? true : (tax.isDefaultSale ?? false),
        isDefaultPurchase: !hasDefaultPurchase && index === 0 ? true : (tax.isDefaultPurchase ?? false),
      })),
    }));
  }
};

// Run migration on module load
ensureDefaultsOnInit();

export const useTaxStore = baseStore;
