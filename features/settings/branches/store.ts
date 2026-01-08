/**
 * @deprecated Use React Query hooks instead:
 * - `useBranches()` for list
 * - `useBranch(id)` for single
 * - `useBranchMutations()` for create/update/delete
 * 
 * Import from: `@/features/settings/branches/hooks/use-branches`
 * 
 * This store will be removed in a future version.
 */
import { createCrudStore, CrudState } from '../../../lib/store-factory';
import type { Branch } from '@/lib/types/prisma-extended';
import { SystemId } from '../../../lib/id-types';

export interface BranchStoreState extends CrudState<Branch> {
  setDefault: (systemId: SystemId) => void;
}

const baseStore = createCrudStore<Branch>([], 'branches');

const setDefault = (systemId: SystemId) => {
  baseStore.setState(state => ({
    data: state.data.map(branch => ({
      ...branch,
      isDefault: branch.systemId === systemId,
    })),
  }));
};

const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;

baseStore.setState({
  add: (item: Omit<Branch, 'systemId'>) => {
    const result = originalAdd(item);
    if ((item as Branch).isDefault) {
      setDefault(result.systemId);
    }
    return result;
  },
  update: (systemId: SystemId, updatedItem: Branch) => {
    originalUpdate(systemId, updatedItem);
    if (updatedItem.isDefault) {
      setDefault(systemId);
    }
  },
} as Partial<BranchStoreState>);

const enhanceState = (state: CrudState<Branch>): BranchStoreState => ({
  ...state,
  setDefault,
});

type BranchStoreHook = (() => BranchStoreState) & {
  getState: () => BranchStoreState;
};

const useBranchStoreBase = (() => enhanceState(baseStore())) as BranchStoreHook;

useBranchStoreBase.getState = () => enhanceState(baseStore.getState());

export const useBranchStore = useBranchStoreBase;
