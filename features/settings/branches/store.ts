import { createCrudStore, CrudState } from '../../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Branch } from './types.ts';
import type { SystemId } from '../../../lib/id-config';

const baseStore = createCrudStore<Branch>(initialData, 'branches');

const augmentedMethods = {
  setDefault: (systemId: SystemId) => {
    baseStore.setState(state => ({
      data: state.data.map(branch => ({
        ...branch,
        isDefault: branch.systemId === systemId,
      })),
    }));
  },
  // Ensure only one default when adding/updating
  add: (item: Omit<Branch, 'systemId'>) => {
    const isDefault = (item as Branch).isDefault;
    const result = baseStore.getState().add(item);
    if (isDefault) {
      augmentedMethods.setDefault(result.systemId);
    }
    return result;
  },
  update: (systemId: SystemId, updatedItem: Branch) => {
    baseStore.getState().update(systemId, updatedItem);
    if (updatedItem.isDefault) {
      augmentedMethods.setDefault(systemId);
    }
  },
};

// Override add and update methods
Object.assign(baseStore.getState(), {
  add: augmentedMethods.add,
  update: augmentedMethods.update,
});

// Export as zustand store directly
export const useBranchStore = baseStore;
