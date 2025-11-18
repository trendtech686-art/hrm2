import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import type { InventoryCheck } from './types.ts';
import { getCurrentUserSystemId } from '../../contexts/user-context.tsx';
import { createSystemId, type SystemId } from '../../lib/id-config.ts';
import { registerBreadcrumbStore } from '../../lib/breadcrumb-generator.ts';

// Sample data
const initialData: InventoryCheck[] = [];

const baseStore = createCrudStore<InventoryCheck>(initialData, 'inventory-checks', {
  businessIdField: 'id',
  persistKey: 'inventory-checks',
  getCurrentUser: getCurrentUserSystemId,
});

// Register for breadcrumb auto-generation
registerBreadcrumbStore('inventory-checks', () => baseStore.getState());

interface InventoryCheckStoreState extends CrudState<InventoryCheck> {
  balanceCheck: (systemId: SystemId) => void;
  cancelCheck: (systemId: SystemId) => void;
}

const augmentedMethods = {
  balanceCheck: (systemId: SystemId) => {
    const state = baseStore.getState();
    const check = state.findById(systemId);
    
    if (!check || check.status !== 'draft') return;
    
    const currentUser = getCurrentUserSystemId();
    
    // Update inventory for each item
    if (check.items && check.items.length > 0) {
      // Import product store và stock history store
      Promise.all([
        import('../products/store.ts'),
        import('../stock-history/store.ts')
      ]).then(([{ useProductStore }, { useStockHistoryStore }]) => {
        const productStore = useProductStore.getState();
        const stockHistoryStore = useStockHistoryStore.getState();
        
        check.items.forEach(item => {
          // Calculate the difference to apply
          const difference = item.actualQuantity - item.systemQuantity;
          
          if (difference !== 0) {
            // Get product to access branch name
            const product = productStore.findById(createSystemId(item.productSystemId));
            const oldQuantity = item.systemQuantity;
            const newQuantity = item.actualQuantity;
            
            // Update inventory in product store - convert to SystemId
            productStore.updateInventory(
              createSystemId(item.productSystemId),
              createSystemId(check.branchSystemId),
              difference
            );
            
            // Add stock history entry with inventory check business ID
            const actionType = difference > 0 
              ? 'Nhập kho (Kiểm hàng)' 
              : 'Xuất kho (Kiểm hàng)';
            
            stockHistoryStore.addEntry({
              productId: item.productSystemId,
              date: new Date().toISOString(),
              employeeName: currentUser || 'Hệ thống',
              action: actionType,
              quantityChange: difference,
              newStockLevel: newQuantity,
              documentId: check.id, // Use business ID (PKK000001)
              branchSystemId: check.branchSystemId,
              branch: check.branchName || 'Chi nhánh',
            });
          }
        });
      });
    }
    
    // Update check status with balanced user and timestamp
    state.update(systemId, {
      ...check,
      status: 'balanced',
      balancedAt: new Date().toISOString(),
      balancedBy: currentUser || 'SYSTEM',
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
