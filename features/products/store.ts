import { createCrudStore, CrudState } from '../../lib/store-factory';
import { data as initialData } from './data';
import type { Product } from './types';
import { type SystemId } from '@/lib/id-types';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { getCurrentUserSystemId } from '../../contexts/auth-context';
import Fuse from 'fuse.js';
import {
  getCurrentUserInfo,
  createCreatedEntry,
  createUpdatedEntry,
  createStatusChangedEntry,
  appendHistoryEntry,
  type HistoryEntry
} from '../../lib/activity-history-helper';

const baseStore = createCrudStore<Product>(initialData, 'products', {
  businessIdField: 'id',
  persistKey: 'hrm-products', // ✅ Enable persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

// Define extended store interface
export interface ProductStoreState extends CrudState<Product> {
  updateInventory: (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => void;
  commitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  uncommitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  dispatchStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  completeDelivery: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  returnStockFromTransit: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  updateLastPurchasePrice: (productSystemId: SystemId, price: number, date: string) => void;
  searchProducts: (query: string, page: number, limit?: number) => Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }>;
}

// Helper to check if product tracks stock
const canModifyStock = (product: Product | undefined): boolean => {
  if (!product) return false;
  // Services, digital products, and combos don't track stock directly
  if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
  // Explicitly disabled stock tracking
  if (product.isStockTracked === false) return false;
  return true;
};

// Define custom methods
const updateInventory = (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!product) return state;
    
    // Skip if product doesn't track stock
    if (!canModifyStock(product)) {
      console.warn(`[updateInventory] Skipped: Product ${productSystemId} does not track stock`);
      return state;
    }
    
    const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
    const newQuantity = oldQuantity + quantityChange;
    
    // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
    // Stock history will be created by inventory check balance instead
    
    return {
      data: state.data.map(p => {
        if (p.systemId === productSystemId) {
          const newInventoryByBranch = { ...p.inventoryByBranch };
          newInventoryByBranch[branchSystemId] = newQuantity;
          return {
            ...p,
            inventoryByBranch: newInventoryByBranch,
          };
        }
        return p;
      }),
    };
  });
};

const commitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!canModifyStock(product)) {
      console.warn(`[commitStock] Skipped: Product ${productSystemId} does not track stock`);
      return state;
    }
    return {
      data: state.data.map(p => {
        if (p.systemId === productSystemId) {
          const newCommitted = { ...p.committedByBranch };
          newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
          return { ...p, committedByBranch: newCommitted };
        }
        return p;
      }),
    };
  });
};

const uncommitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!canModifyStock(product)) {
      console.warn(`[uncommitStock] Skipped: Product ${productSystemId} does not track stock`);
      return state;
    }
    return {
      data: state.data.map(p => {
        if (p.systemId === productSystemId) {
          const newCommitted = { ...p.committedByBranch };
          newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
          return { ...p, committedByBranch: newCommitted };
        }
        return p;
      }),
    };
  });
};

const dispatchStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  console.log('🔴 [dispatchStock] Called with:', { productSystemId, branchSystemId, quantity });
  
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!product) {
      console.error('❌ [dispatchStock] Product not found:', productSystemId);
      return state;
    }
    
    // Skip if product doesn't track stock
    if (!canModifyStock(product)) {
      console.warn(`[dispatchStock] Skipped: Product ${productSystemId} does not track stock`);
      return state;
    }
    
    console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
    console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
    
    return {
      data: state.data.map(product => {
        if (product.systemId === productSystemId) {
          const newInventory = { ...product.inventoryByBranch };
          const oldInventory = newInventory[branchSystemId] || 0;
          newInventory[branchSystemId] = oldInventory - quantity;
          
          const newCommitted = { ...product.committedByBranch };
          newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);

          const newInTransit = { ...product.inTransitByBranch };
          newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
          
          console.log('✅ [dispatchStock] Updated inventory:', {
            old: oldInventory,
            new: newInventory[branchSystemId],
            change: -quantity
          });
          
          return { 
            ...product, 
            inventoryByBranch: newInventory,
            committedByBranch: newCommitted,
            inTransitByBranch: newInTransit,
          };
        }
        return product;
      }),
    };
  });
  
  console.log('✅ [dispatchStock] Completed');
};

const completeDelivery = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!canModifyStock(product)) {
      return state;
    }
    return {
      data: state.data.map(p => {
        if (p.systemId === productSystemId) {
          const newInTransit = { ...p.inTransitByBranch };
          newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
          return { ...p, inTransitByBranch: newInTransit };
        }
        return p;
      }),
    };
  });
};

const returnStockFromTransit = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!canModifyStock(product)) {
      return state;
    }
    return {
      data: state.data.map(p => {
        if (p.systemId === productSystemId) {
          const newInTransit = { ...p.inTransitByBranch };
          newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
          const newInventory = { ...p.inventoryByBranch };
          newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
          return { ...p, inventoryByBranch: newInventory, inTransitByBranch: newInTransit };
        }
        return p;
      }),
    };
  });
};

const updateLastPurchasePrice = (productSystemId: SystemId, price: number, date: string) => {
  baseStore.setState(state => ({
    data: state.data.map(product => {
      if (product.systemId === productSystemId) {
        // Only update if the new date is newer or equal to the existing lastPurchaseDate
        const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
        const newDateTs = new Date(date).getTime();
        
        if (newDateTs >= existingDate) {
          return {
            ...product,
            lastPurchasePrice: price,
            lastPurchaseDate: date,
          };
        }
      }
      return product;
    }),
  }));
};

const searchProducts = async (query: string, page: number = 1, limit: number = 10): Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }> => {
  const allProducts = baseStore.getState().data;
  
  // ✅ Create fresh Fuse instance with current data (avoid stale data)
  const fuse = new Fuse(allProducts, {
    keys: ['name', 'id', 'sku', 'barcode'],
    threshold: 0.3,
  });
  
  const results = fuse.search(query);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  return {
    items: paginatedResults.map(result => ({
      value: asSystemId(result.item.systemId),
      label: `${result.item.name} (${result.item.id})`,
    })),
    hasNextPage: endIndex < results.length,
  };
};

// Wrapped add method with activity history logging
const addProduct = (product: Omit<Product, 'systemId'>) => {
  const userInfo = getCurrentUserInfo();
  const newProduct = baseStore.getState().add(product);
  
  // Add activity history entry
  const historyEntry = createCreatedEntry(
    userInfo,
    `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`
  );
  baseStore.getState().update(newProduct.systemId, {
    ...newProduct,
    activityHistory: [historyEntry]
  });
  
  return newProduct;
};

// Wrapped update method with activity history logging
const updateProduct = (systemId: SystemId, updatedProduct: Product) => {
  const userInfo = getCurrentUserInfo();
  const existingProduct = baseStore.getState().data.find(p => p.systemId === systemId);
  const historyEntries: HistoryEntry[] = [];
  
  if (existingProduct) {
    // Track status changes
    if (existingProduct.status !== updatedProduct.status) {
      const statusLabels: Record<string, string> = {
        'active': 'Đang kinh doanh',
        'inactive': 'Ngừng kinh doanh',
        'discontinued': 'Ngừng sản xuất'
      };
      historyEntries.push(createStatusChangedEntry(
        userInfo,
        statusLabels[existingProduct.status || 'active'],
        statusLabels[updatedProduct.status || 'active'],
        `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`
      ));
    }
    
    // Track field changes
    const fieldsToTrack: Array<{ key: keyof Product; label: string }> = [
      { key: 'name', label: 'Tên sản phẩm' },
      { key: 'id', label: 'Mã SKU' },
      { key: 'description', label: 'Mô tả' },
      { key: 'shortDescription', label: 'Mô tả ngắn' },
      { key: 'type', label: 'Loại sản phẩm' },
      { key: 'categorySystemId', label: 'Danh mục' },
      { key: 'brandSystemId', label: 'Thương hiệu' },
      { key: 'unit', label: 'Đơn vị tính' },
      { key: 'costPrice', label: 'Giá vốn' },
      { key: 'minPrice', label: 'Giá tối thiểu' },
      { key: 'barcode', label: 'Mã vạch' },
      { key: 'primarySupplierSystemId', label: 'Nhà cung cấp chính' },
      { key: 'warrantyPeriodMonths', label: 'Thời hạn bảo hành' },
      { key: 'reorderLevel', label: 'Mức đặt hàng lại' },
      { key: 'safetyStock', label: 'Tồn kho an toàn' },
      { key: 'maxStock', label: 'Tồn kho tối đa' },
    ];
    
    const changes: string[] = [];
    for (const field of fieldsToTrack) {
      const oldVal = existingProduct[field.key];
      const newVal = updatedProduct[field.key];
      if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
        if (field.key === 'status') continue;
        const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
        const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
        changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
      }
    }
    
    // Track price changes separately
    if (existingProduct.costPrice !== updatedProduct.costPrice) {
      changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
    }
    
    if (changes.length > 0) {
      historyEntries.push(createUpdatedEntry(
        userInfo,
        `${userInfo.name} đã cập nhật: ${changes.join(', ')}`
      ));
    }
  }
  
  const productWithHistory = {
    ...updatedProduct,
    activityHistory: appendHistoryEntry(existingProduct?.activityHistory, ...historyEntries)
  };
  
  baseStore.getState().update(systemId, productWithHistory);
};

// Export typed hook that includes both base and custom methods
export const useProductStore = (): ProductStoreState => {
  const state = baseStore();
  return {
    ...state,
    add: addProduct,
    update: updateProduct,
    updateInventory,
    commitStock,
    uncommitStock,
    dispatchStock,
    completeDelivery,
    returnStockFromTransit,
    updateLastPurchasePrice,
    searchProducts,
  };
};

// Export getState method for non-hook usage
useProductStore.getState = () => {
  const state = baseStore.getState();
  return {
    ...state,
    add: addProduct,
    update: updateProduct,
    updateInventory,
    commitStock,
    uncommitStock,
    dispatchStock,
    completeDelivery,
    returnStockFromTransit,
    updateLastPurchasePrice,
    searchProducts,
  };
};

(useProductStore as typeof useProductStore & { subscribe?: typeof baseStore.subscribe }).subscribe = baseStore.subscribe;
