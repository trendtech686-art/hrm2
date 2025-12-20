import { createCrudStore, CrudState } from '../../lib/store-factory';
import { data as initialData } from './data';
import type { Supplier } from './types';
import type { SystemId } from '../../lib/id-types';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import Fuse from 'fuse.js';
import { getCurrentUserSystemId } from '../../contexts/auth-context';

const baseStore = createCrudStore<Supplier>(initialData, 'suppliers', {
  businessIdField: 'id',
  persistKey: 'hrm-suppliers', // ✅ Enable persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

const fuse = new Fuse(baseStore.getState().data, {
    keys: ['name', 'id', 'phone'],
    threshold: 0.3,
});

// Define enhanced interface
interface SupplierStoreState extends CrudState<Supplier> {
  searchSuppliers: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
  updateStatus: (systemIds: SystemId[], status: Supplier['status']) => void;
  bulkDelete: (systemIds: SystemId[]) => void;
}

// Augmented methods
const augmentedMethods = {
    searchSuppliers: async (query: string, page: number, limit: number = 20) => {
        return new Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>(resolve => {
            setTimeout(() => {
                const allSuppliers = baseStore.getState().data;
                const results = query ? fuse.search(query).map(r => r.item) : allSuppliers;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map(s => ({ value: s.systemId, label: s.name })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    },
    updateStatus: (systemIds: SystemId[], status: Supplier['status']) => {
        const currentUser = asSystemId(getCurrentUserSystemId());
        baseStore.setState((state) => ({
            data: state.data.map((item) =>
                systemIds.includes(item.systemId)
                    ? { ...item, status, updatedBy: currentUser, updatedAt: new Date().toISOString() }
                    : item
            ),
        }));
    },
    bulkDelete: (systemIds: SystemId[]) => {
        const currentUser = asSystemId(getCurrentUserSystemId());
        baseStore.setState((state) => ({
            data: state.data.map((item) =>
                systemIds.includes(item.systemId)
                    ? { ...item, isDeleted: true, deletedBy: currentUser, deletedAt: new Date().toISOString() }
                    : item
            ),
        }));
    }
};

// Export typed hook
export const useSupplierStore = (): SupplierStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
useSupplierStore.getState = (): SupplierStoreState => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
