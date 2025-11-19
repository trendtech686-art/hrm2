import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Employee } from './types.ts';
import Fuse from 'fuse.js';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { registerBreadcrumbStore } from '../../lib/breadcrumb-generator'; // ✅ NEW
import { asSystemId, asBusinessId, type SystemId } from '../../lib/id-types.ts';

const baseStore = createCrudStore<Employee>(initialData, 'employees', {
  businessIdField: 'id',
  persistKey: 'hrm-employees', // ✅ Enable localStorage persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

// ✅ Register for breadcrumb auto-generation
registerBreadcrumbStore('employees', () => baseStore.getState());

// Define enhanced interface
interface EmployeeStoreState extends CrudState<Employee> {
  searchEmployees: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
  permanentDelete: (systemId: SystemId) => void;
}

// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query: string, page: number, limit: number = 20) => {
        return new Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>(resolve => {
            setTimeout(() => {
                const allEmployees = baseStore.getState().data;
                
                // ✅ Create fresh Fuse instance with current data
                const fuse = new Fuse(allEmployees, {
                    keys: ['fullName', 'id', 'phone', 'personalEmail', 'workEmail'],
                    threshold: 0.3,
                });
                
                const results = query ? fuse.search(query).map(r => r.item) : allEmployees;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map(e => ({ value: e.systemId, label: e.fullName })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    },
    permanentDelete: (systemId: SystemId) => {
        baseStore.getState().hardDelete(systemId);
    }
};

// Export typed hook
export const useEmployeeStore = (): EmployeeStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods, // This includes permanentDelete
  };
};

// Export getState for non-hook usage
useEmployeeStore.getState = (): EmployeeStoreState => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
