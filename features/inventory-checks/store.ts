import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import type { InventoryCheck } from './types.ts';
import { data as initialData } from './data.ts';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { asSystemId } from '../../lib/id-types.ts';
import type { SystemId } from '../../lib/id-types.ts';
import { registerBreadcrumbStore } from '../../lib/breadcrumb-generator.ts';
import { useEmployeeStore } from '../employees/store.ts';

const baseStore = createCrudStore<InventoryCheck>(initialData, 'inventory-checks', {
  businessIdField: 'id',
  persistKey: 'inventory-checks',
  getCurrentUser: getCurrentUserSystemId,
});

// Register for breadcrumb auto-generation
registerBreadcrumbStore('inventory-checks', () => baseStore.getState());

interface InventoryCheckStoreState extends CrudState<InventoryCheck> {
  balanceCheck: (systemId: SystemId) => Promise<void>;
  cancelCheck: (systemId: SystemId) => void;
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
        import('../products/store.ts'),
        import('../stock-history/store.ts')
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
    
    // Update check status with balanced user and timestamp
    state.update(systemId, {
      ...check,
      status: 'balanced',
      balancedAt: new Date().toISOString(),
      balancedBy: asSystemId(currentUserSystemId),
    });
  },
  
  cancelCheck: (systemId: SystemId) => {
    const state = baseStore.getState();
    const check = state.findById(systemId);
    
    if (!check || check.status === 'cancelled') return;
    
    state.update(systemId, {
      ...check,
      status: 'cancelled',
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
