import { createCrudStore, CrudState } from '../../../lib/store-factory';
import { data as initialData } from './data';
import type { Branch } from './types';
import { SystemId } from '../../../lib/id-types';

export interface BranchStoreState extends CrudState<Branch> {
  setDefault: (systemId: SystemId) => void;
}

const baseStore = createCrudStore<Branch>(initialData, 'branches');

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
