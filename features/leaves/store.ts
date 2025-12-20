import { createCrudStore, type CrudState } from '../../lib/store-factory';
import { data as initialData } from './data';
import type { LeaveRequest } from './types';
import { leaveAttendanceSync } from './leave-sync-service';
import { leaveQuotaSync } from './leave-quota-service';

export type LeaveStoreState = CrudState<LeaveRequest>;

const baseStore = createCrudStore<LeaveRequest>(initialData, 'leaves', {
	businessIdField: 'id',
	persistKey: 'hrm-leaves',
});

const isApproved = (leave?: LeaveRequest | null): leave is LeaveRequest =>
	Boolean(leave && leave.status === 'Đã duyệt');

const snapshotLeave = (leave?: LeaveRequest | null): LeaveRequest | undefined =>
	leave ? { ...leave } : undefined;

const syncApprovedLeave = {
	apply: (leave: LeaveRequest) => {
		leaveAttendanceSync.apply(leave);
		leaveQuotaSync.apply(leave);
	},
	clear: (leave: LeaveRequest) => {
		leaveAttendanceSync.clear(leave);
		leaveQuotaSync.clear(leave);
	},
};

const syncAwareActions: Pick<LeaveStoreState, 'add' | 'update' | 'remove' | 'restore' | 'hardDelete'> = {
	add: (payload) => {
		const created = baseStore.getState().add(payload);
		if (isApproved(created)) {
			syncApprovedLeave.apply(created);
		}
		return created;
	},
	update: (systemId, next) => {
		const store = baseStore.getState();
		const previous = snapshotLeave(store.findById(systemId));
		store.update(systemId, next);
		const updated = snapshotLeave(baseStore.getState().findById(systemId));
		if (isApproved(previous)) {
			syncApprovedLeave.clear(previous);
		}
		if (isApproved(updated)) {
			syncApprovedLeave.apply(updated);
		}
	},
	remove: (systemId) => {
		const store = baseStore.getState();
		const target = snapshotLeave(store.findById(systemId));
		store.remove(systemId);
		if (isApproved(target)) {
			syncApprovedLeave.clear(target);
		}
	},
	restore: (systemId) => {
		const store = baseStore.getState();
		store.restore(systemId);
		const restored = snapshotLeave(baseStore.getState().findById(systemId));
		if (isApproved(restored)) {
			syncApprovedLeave.apply(restored);
		}
	},
	hardDelete: (systemId) => {
		const store = baseStore.getState();
		const target = snapshotLeave(store.findById(systemId));
		store.hardDelete(systemId);
		if (isApproved(target)) {
			syncApprovedLeave.clear(target);
		}
	},
};

const withSync = (state: LeaveStoreState): LeaveStoreState => ({
	...state,
	...syncAwareActions,
});

export const useLeaveStore = () => withSync(baseStore());

useLeaveStore.getState = () => withSync(baseStore.getState());
