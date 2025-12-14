import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Employee } from './types.ts';
import type { HistoryEntry } from '../../components/ActivityHistory.tsx';
import Fuse from 'fuse.js';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { registerBreadcrumbStore } from '../../lib/breadcrumb-generator'; // ✅ NEW
import { type SystemId } from '../../lib/id-types.ts';
import { createInMemoryRepository } from '../../repositories/in-memory-repository.ts';
import { 
  createHistoryEntry, 
  getCurrentUserInfo,
  appendHistoryEntry 
} from '../../lib/activity-history-helper.ts';

type EmployeePersistenceAdapter = {
  create: (payload: Omit<Employee, 'systemId'>) => Promise<Employee>;
  update: (systemId: SystemId, payload: Partial<Employee>) => Promise<Employee>;
  softDelete: (systemId: SystemId) => Promise<void>;
  restore: (systemId: SystemId) => Promise<Employee | undefined>;
  hardDelete: (systemId: SystemId) => Promise<void>;
};

const baseStore = createCrudStore<Employee>(initialData, 'employees', {
  businessIdField: 'id',
  persistKey: 'hrm-employees', // ✅ Enable localStorage persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item: Omit<Employee, 'systemId'>): Employee => {
  const userInfo = getCurrentUserInfo();
  const historyEntry = createHistoryEntry(
    'created',
    `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`,
    userInfo
  );
  
  const newEmployee = originalAdd({
    ...item,
    activityHistory: [historyEntry],
  });
  
  return newEmployee;
};

// ✅ Wrap update method to include activity history
const originalUpdate = baseStore.getState().update;
const wrappedUpdate = (systemId: SystemId, updates: Partial<Employee>): void => {
  const currentEmployee = baseStore.getState().data.find(e => e.systemId === systemId);
  if (!currentEmployee) return;
  
  const userInfo = getCurrentUserInfo();
  const historyEntries: HistoryEntry[] = [];
  
  // Track important field changes
  const trackedFields: { key: keyof Employee; label: string }[] = [
    { key: 'fullName', label: 'họ tên' },
    { key: 'jobTitle', label: 'chức danh' },
    { key: 'department', label: 'phòng ban' },
    { key: 'employmentStatus', label: 'trạng thái làm việc' },
    { key: 'employeeType', label: 'loại nhân viên' },
    { key: 'baseSalary', label: 'lương cơ bản' },
    { key: 'phone', label: 'số điện thoại' },
    { key: 'workEmail', label: 'email công việc' },
    { key: 'role', label: 'vai trò' },
  ];
  
  trackedFields.forEach(({ key, label }) => {
    if (updates[key] !== undefined && updates[key] !== currentEmployee[key]) {
      const oldValue = currentEmployee[key];
      const newValue = updates[key];
      
      // Format values for display
      let oldDisplay = oldValue;
      let newDisplay = newValue;
      
      if (key === 'baseSalary') {
        oldDisplay = new Intl.NumberFormat('vi-VN').format(oldValue as number) + 'đ';
        newDisplay = new Intl.NumberFormat('vi-VN').format(newValue as number) + 'đ';
      }
      
      historyEntries.push(createHistoryEntry(
        'updated',
        `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`,
        userInfo,
        { field: key, oldValue, newValue }
      ));
    }
  });
  
  // If status changed specifically
  if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
    historyEntries.push(createHistoryEntry(
      'status_changed',
      `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`,
      userInfo,
      { field: 'employmentStatus', oldValue: currentEmployee.employmentStatus, newValue: updates.employmentStatus }
    ));
  }
  
  // If no specific changes tracked, add generic update entry
  if (historyEntries.length === 0) {
    historyEntries.push(createHistoryEntry(
      'updated',
      `${userInfo.name} đã cập nhật thông tin nhân viên`,
      userInfo
    ));
  }
  
  const updatedHistory = appendHistoryEntry(currentEmployee.activityHistory, ...historyEntries);
  
  originalUpdate(systemId, {
    ...updates,
    activityHistory: updatedHistory,
  });
};

// ✅ Override base store methods
baseStore.setState({
  add: wrappedAdd,
  update: wrappedUpdate,
});

export const employeeRepository = createInMemoryRepository<Employee>(() => baseStore.getState());

const persistence: EmployeePersistenceAdapter = {
  create: (payload) => employeeRepository.create(payload),
  update: (systemId, payload) => employeeRepository.update(systemId, payload),
  softDelete: (systemId) => employeeRepository.softDelete(systemId),
  restore: (systemId) => employeeRepository.restore(systemId),
  hardDelete: (systemId) => employeeRepository.hardDelete(systemId),
};

// ✅ Register for breadcrumb auto-generation
registerBreadcrumbStore('employees', () => baseStore.getState());

// Define enhanced interface
interface EmployeeStoreState extends CrudState<Employee> {
  searchEmployees: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
  permanentDelete: (systemId: SystemId) => Promise<void>;
  persistence: EmployeePersistenceAdapter;
}

type EmployeeStoreHook = (() => EmployeeStoreState) & {
  getState: () => EmployeeStoreState;
  persistence: EmployeePersistenceAdapter;
};

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
    permanentDelete: async (systemId: SystemId) => {
        await persistence.hardDelete(systemId);
    }
};

const useEmployeeStoreHook = (): EmployeeStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods, // This includes permanentDelete
    persistence,
  };
};

export const useEmployeeStore = useEmployeeStoreHook as EmployeeStoreHook;

// Export getState for non-hook usage
useEmployeeStore.getState = (): EmployeeStoreState => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
    persistence,
  };
};

useEmployeeStore.persistence = persistence;
