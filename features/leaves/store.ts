import { createCrudStore, type CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { LeaveRequest } from './types.ts';

export type LeaveStoreState = CrudState<LeaveRequest>;

const baseStore = createCrudStore<LeaveRequest>(initialData, 'leaves', {
	businessIdField: 'id',
	persistKey: 'hrm-leaves',
});

export const useLeaveStore = baseStore;

useLeaveStore.getState = baseStore.getState;
