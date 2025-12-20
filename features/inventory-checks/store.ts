import { createCrudStore, CrudState } from '../../lib/store-factory';
import type { InventoryCheck } from './types';
import type { HistoryEntry } from '../../components/ActivityHistory';
import { data as initialData } from './data';
import { getCurrentUserSystemId } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';
import type { SystemId } from '../../lib/id-types';
import { registerBreadcrumbStore } from '../../lib/breadcrumb-generator';
import { useEmployeeStore } from '../employees/store';

// Helper to get current user info
const getCurrentUserInfo = () => {
  const currentUserSystemId = getCurrentUserSystemId();
  const employee = useEmployeeStore.getState().data.find(e => e.systemId === currentUserSystemId);
  return {
    systemId: currentUserSystemId || 'SYSTEM',
    name: employee?.fullName || 'Hệ thống',
    avatar: employee?.avatarUrl,
  };
};

// Helper to create history entry
const createHistoryEntry = (
  action: HistoryEntry['action'],
  description: string,
  metadata?: HistoryEntry['metadata']
): HistoryEntry => ({
  id: crypto.randomUUID(),
  action,
  timestamp: new Date(),
  user: getCurrentUserInfo(),
  description,
  metadata,
});

const baseStore = createCrudStore<InventoryCheck>(initialData, 'inventory-checks', {
  businessIdField: 'id',
  persistKey: 'inventory-checks',
  getCurrentUser: getCurrentUserSystemId,
});

// Register for breadcrumb auto-generation
registerBreadcrumbStore('inventory-checks', () => baseStore.getState());

interface InventoryCheckStoreState extends CrudState<InventoryCheck> {
  balanceCheck: (systemId: SystemId) => Promise<void>;
  cancelCheck: (systemId: SystemId, reason?: string) => void;
}

const augmentedMethods = {
  balanceCheck: async (systemId: SystemId) => {
    const state = baseStore.getState();
    const check = state.findById(systemId);
    
    if (!check || check.status !== 'draft') return;
    
    const currentUserSystemId = getCurrentUserSystemId();
    const currentEmployeeName = useEmployeeStore.getState().data.find(e => e.systemId === currentUserSystemId)?.fullName || 'Hệ thống';
    
    // Update inventory for each item
    if (check.items && check.items.length > 0) {
      const [{ useProductStore }, { useStockHistoryStore }] = await Promise.all([
        import('../products/store'),
        import('../stock-history/store')
      ]);

      const productStore = useProductStore.getState();
      const stockHistoryStore = useStockHistoryStore.getState();

      check.items.forEach(item => {
        const difference = (item.actualQuantity ?? 0) - (item.systemQuantity ?? 0);
        if (difference === 0) return;

        productStore.updateInventory(
          item.productSystemId,
          check.branchSystemId,
          difference
        );

        const actionType = difference > 0
          ? 'Nhập kho (Kiểm hàng)'
          : 'Xuất kho (Kiểm hàng)';

        stockHistoryStore.addEntry({
          productId: item.productSystemId,
          date: new Date().toISOString(),
          employeeName: currentEmployeeName,
          action: actionType,
          quantityChange: difference,
          newStockLevel: item.actualQuantity ?? 0,
          documentId: check.id,
          branchSystemId: check.branchSystemId,
          branch: check.branchName || 'Chi nhánh',
        });
      });
    }
    
    // Add history entry for balance action
    const historyEntry = createHistoryEntry(
      'status_changed',
      'Đã cân bằng phiếu kiểm kho',
      { oldValue: 'Nháp', newValue: 'Đã cân bằng' }
    );
    
    // Update check status with balanced user and timestamp
    state.update(systemId, {
      ...check,
      status: 'balanced',
      balancedAt: new Date().toISOString(),
      balancedBy: asSystemId(currentUserSystemId),
      activityHistory: [...(check.activityHistory || []), historyEntry],
    });
  },
  
  cancelCheck: (systemId: SystemId, reason?: string) => {
    const state = baseStore.getState();
    const check = state.findById(systemId);
    
    if (!check || check.status === 'cancelled') return;
    
    const statusLabel = check.status === 'draft' ? 'Nháp' : 'Đã cân bằng';
    const historyEntry = createHistoryEntry(
      'cancelled',
      `Đã hủy phiếu kiểm kho${reason ? `: ${reason}` : ''}`,
      { oldValue: statusLabel, newValue: 'Đã hủy', note: reason }
    );
    
    state.update(systemId, {
      ...check,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: asSystemId(getCurrentUserSystemId()),
      cancelledReason: reason ?? '',
      activityHistory: [...(check.activityHistory || []), historyEntry],
    });
  },
};

export const useInventoryCheckStore = (): InventoryCheckStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

useInventoryCheckStore.getState = (): InventoryCheckStoreState => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
