/**
 * @deprecated This file is DEPRECATED and should NOT be used!
 * 
 * REASON: Loading all data with limit=10000 causes severe performance issues:
 * - 18-27s compile time in development
 * - 500MB+ memory usage
 * - Slow page navigation
 * 
 * SOLUTION: Use React Query hooks for paginated data fetching instead.
 * See: hooks/api/use-paginated-data.ts
 * See: features/orders/hooks/use-orders.ts (example pattern)
 * 
 * This file is kept for reference only. The ApiSyncProvider is disabled
 * in app/providers.tsx.
 * 
 * Migration Plan: docs/ZUSTAND-TO-REACT-QUERY-MIGRATION.md
 */

import { useEffect, useRef, useState } from 'react';

// ============== CORE STORE IMPORTS ==============
import { useEmployeeStore } from '@/features/employees/store';
import { useCustomerStore } from '@/features/customers/store';
import { useProductStore } from '@/features/products/store';
import { useOrderStore } from '@/features/orders/store';
import { useSupplierStore } from '@/features/suppliers/store';
import { useWarrantyStore } from '@/features/warranty/store';
import { useWikiStore } from '@/features/wiki/store';

// ============== TRANSACTION STORE IMPORTS ==============
import { useLeaveStore } from '@/features/leaves/store';
import { usePurchaseOrderStore } from '@/features/purchase-orders/store';
import { usePurchaseReturnStore } from '@/features/purchase-returns/store';
import { useSalesReturnStore } from '@/features/sales-returns/store';
import { useInventoryReceiptStore } from '@/features/inventory-receipts/store';
import { useInventoryCheckStore } from '@/features/inventory-checks/store';
import { useStockLocationStore } from '@/features/stock-locations/store';
import { useTaskStore } from '@/features/tasks/store';

// ============== FINANCE STORE IMPORTS ==============
import { useCashbookStore } from '@/features/cashbook/store';
import { useReceiptStore } from '@/features/receipts/store';
import { usePaymentStore } from '@/features/payments/store';

// ============== CUSTOM STORES WITH loadFromAPI ==============
import { useStockTransferStore } from '@/features/stock-transfers/store';
import { useStockHistoryStore } from '@/features/stock-history/store';
import { usePayrollBatchStore } from '@/features/payroll/payroll-batch-store';
import { usePayrollTemplateStore } from '@/features/payroll/payroll-template-store';
import { useDocumentStore as useEmployeeDocumentStore } from '@/features/employees/document-store';
import { useEmployeeCompStore } from '@/features/employees/employee-comp-store';

// ============== SETTINGS STORE IMPORTS ==============
import { useGlobalSettingsStore } from '@/features/settings/global-settings-store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useDepartmentStore } from '@/features/settings/departments/store';
import { useJobTitleStore } from '@/features/settings/job-titles/store';
import { useUnitStore } from '@/features/settings/units/store';
import { useTaxStore } from '@/features/settings/taxes/store';
import { useSalesChannelStore } from '@/features/settings/sales-channels/store';
import { useShippingPartnerStore } from '@/features/settings/shipping/store';
import { useTargetGroupStore } from '@/features/settings/target-groups/store';
import { useReceiptTypeStore } from '@/features/settings/receipt-types/store';
import { usePaymentTypeStore } from '@/features/settings/payments/types/store';
import { usePricingPolicyStore } from '@/features/settings/pricing/store';
import { usePenaltyStore, usePenaltyTypeStore } from '@/features/settings/penalties/store';
import { usePaymentMethodStore } from '@/features/settings/payments/methods/store';
import { useAppearanceStore } from '@/features/settings/appearance/store';
import { useShippingSettingsStore } from '@/features/settings/shipping/shipping-settings-store';
import { useEmployeeSettingsStore } from '@/features/settings/employees/employee-settings-store';
import { useTrendtechSettingsStore as useTrendtechStore } from '@/features/settings/trendtech/store';
import { usePkgxSettingsStore as usePkgxStore } from '@/features/settings/pkgx/store';

// ============== CORE TYPE IMPORTS ==============
import type { Employee } from '@/lib/types/prisma-extended';
import type { Customer } from '@/lib/types/prisma-extended';
import type { Product } from '@/lib/types/prisma-extended';
import type { Order } from '@/features/orders/store';
import type { Supplier } from '@/lib/types/prisma-extended';
import type { WarrantyTicket } from '@/lib/types/prisma-extended';
import type { WikiArticle } from '@/features/wiki/store';

// ============== TRANSACTION TYPE IMPORTS ==============
import type { LeaveRequest } from '@/lib/types/prisma-extended';
import type { PurchaseOrder } from '@/features/purchase-orders/store';
import type { PurchaseReturn } from '@/features/purchase-returns/store';
import type { SalesReturn } from '@/features/sales-returns/store';
import type { InventoryReceipt } from '@/features/inventory-receipts/store';
import type { InventoryCheckModel as InventoryCheck } from '@/generated/prisma/models/InventoryCheck';
import type { StockLocation } from '@/features/stock-locations/store';
import type { Task } from '@/features/tasks/store';

// ============== SETTINGS TYPE IMPORTS ==============
import type { 
  Branch, 
  Department, 
  JobTitle, 
  Unit, 
  Tax, 
  SalesChannel, 
  ShippingPartner, 
  TargetGroup,
  ReceiptType,
  PaymentType,
} from '@/lib/types/prisma-extended';
import type { PricingPolicy } from '@/lib/types/prisma-extended';
import type { Penalty, PenaltyType } from '@/lib/types/prisma-extended';

// ============== API FETCH HELPER ==============
async function fetchFromAPI<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      console.warn(`[API Sync] Failed to fetch ${endpoint}: ${response.status}`);
      return [];
    }
    
    const json = await response.json();
    return json.data ?? json ?? [];
  } catch (error) {
    console.warn(`[API Sync] Error fetching ${endpoint}:`, error);
    return [];
  }
}

// ============== GENERIC SYNC HELPER ==============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncStore<T extends { systemId: string }>(
  storeName: string,
  endpoint: string,
  useStore: any,
  updateStatus: (status: SyncStatus) => void
) {
  try {
    const items = await fetchFromAPI<T>(endpoint);
    if (items.length > 0) {
      const store = useStore.getState();
      const apiIds = new Set(items.map((item: T) => item.systemId));
      const localOnly = (store.data || []).filter((item: T) => !apiIds.has(item.systemId));
      
      if (useStore.setState) {
        useStore.setState({ data: [...items, ...localOnly] });
      }
      console.log(`[API Sync] ${storeName}: ${items.length} from API`);
    }
    updateStatus('success');
  } catch (e) {
    console.error(`[API Sync] ${storeName} failed:`, e);
    updateStatus('error');
  }
}

// ============== SYNC STATUS TYPE ==============
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncState {
  // Core Entities
  employees: SyncStatus;
  customers: SyncStatus;
  products: SyncStatus;
  orders: SyncStatus;
  suppliers: SyncStatus;
  warranties: SyncStatus;
  wiki: SyncStatus;
  // Transactions
  leaves: SyncStatus;
  purchaseOrders: SyncStatus;
  purchaseReturns: SyncStatus;
  salesReturns: SyncStatus;
  inventoryReceipts: SyncStatus;
  inventoryChecks: SyncStatus;
  stockLocations: SyncStatus;
  tasks: SyncStatus;
  // Finance
  cashbook: SyncStatus;
  receipts: SyncStatus;
  payments: SyncStatus;
  // Custom stores
  stockTransfers: SyncStatus;
  stockHistory: SyncStatus;
  payrollBatches: SyncStatus;
  payrollTemplates: SyncStatus;
  employeeDocuments: SyncStatus;
  employeeComp: SyncStatus;
  // Settings
  branches: SyncStatus;
  departments: SyncStatus;
  jobTitles: SyncStatus;
  units: SyncStatus;
  taxes: SyncStatus;
  salesChannels: SyncStatus;
  shippingPartners: SyncStatus;
  targetGroups: SyncStatus;
  receiptTypes: SyncStatus;
  paymentTypes: SyncStatus;
  pricingPolicies: SyncStatus;
  penalties: SyncStatus;
  penaltyTypes: SyncStatus;
  paymentMethods: SyncStatus;
  appearance: SyncStatus;
  shippingSettings: SyncStatus;
  employeeSettings: SyncStatus;
  trendtech: SyncStatus;
  pkgx: SyncStatus;
  settings: SyncStatus;
}

const INITIAL_SYNC_STATE: SyncState = {
  // Core Entities
  employees: 'idle',
  customers: 'idle',
  products: 'idle',
  orders: 'idle',
  suppliers: 'idle',
  warranties: 'idle',
  wiki: 'idle',
  // Transactions
  leaves: 'idle',
  purchaseOrders: 'idle',
  purchaseReturns: 'idle',
  salesReturns: 'idle',
  inventoryReceipts: 'idle',
  inventoryChecks: 'idle',
  stockLocations: 'idle',
  tasks: 'idle',
  // Finance
  cashbook: 'idle',
  receipts: 'idle',
  payments: 'idle',
  // Custom stores
  stockTransfers: 'idle',
  stockHistory: 'idle',
  payrollBatches: 'idle',
  payrollTemplates: 'idle',
  employeeDocuments: 'idle',
  employeeComp: 'idle',
  // Settings
  branches: 'idle',
  departments: 'idle',
  jobTitles: 'idle',
  units: 'idle',
  taxes: 'idle',
  salesChannels: 'idle',
  shippingPartners: 'idle',
  targetGroups: 'idle',
  receiptTypes: 'idle',
  paymentTypes: 'idle',
  pricingPolicies: 'idle',
  penalties: 'idle',
  penaltyTypes: 'idle',
  paymentMethods: 'idle',
  appearance: 'idle',
  shippingSettings: 'idle',
  employeeSettings: 'idle',
  trendtech: 'idle',
  pkgx: 'idle',
  settings: 'idle',
};

// ============== MAIN HOOK ==============
export function useApiSync() {
  const [syncState, setSyncState] = useState<SyncState>(INITIAL_SYNC_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const syncStartedRef = useRef(false);

  useEffect(() => {
    if (syncStartedRef.current) return;
    syncStartedRef.current = true;
    
    const syncAll = async () => {
      const updateStatus = (key: keyof SyncState, status: SyncStatus) => {
        setSyncState(prev => ({ ...prev, [key]: status }));
      };

      // Mark all as syncing
      Object.keys(INITIAL_SYNC_STATE).forEach(key => {
        updateStatus(key as keyof SyncState, 'syncing');
      });

      // Sync all stores in PARALLEL for faster loading
      await Promise.all([
        // ============== CORE ENTITIES ==============
        syncStore<Employee>('employees', '/api/employees?limit=10000', useEmployeeStore, s => updateStatus('employees', s)),
        syncStore<Customer>('customers', '/api/customers?limit=10000', useCustomerStore, s => updateStatus('customers', s)),
        syncStore<Product>('products', '/api/products?limit=10000', useProductStore, s => updateStatus('products', s)),
        syncStore<Order>('orders', '/api/orders?limit=10000', useOrderStore, s => updateStatus('orders', s)),
        syncStore<Supplier>('suppliers', '/api/suppliers?limit=10000', useSupplierStore, s => updateStatus('suppliers', s)),
        syncStore<WarrantyTicket>('warranties', '/api/warranties?limit=10000', useWarrantyStore, s => updateStatus('warranties', s)),
        
        // Wiki has loadFromAPI
        (async () => {
          try {
            await useWikiStore.getState().loadFromAPI();
            console.log('[API Sync] wiki: synced from API');
            updateStatus('wiki', 'success');
          } catch (e) {
            console.error('[API Sync] wiki failed:', e);
            updateStatus('wiki', 'error');
          }
        })(),

        // ============== TRANSACTIONS ==============
        syncStore<LeaveRequest>('leaves', '/api/leaves?limit=10000', useLeaveStore, s => updateStatus('leaves', s)),
        syncStore<PurchaseOrder>('purchaseOrders', '/api/purchase-orders?limit=10000', usePurchaseOrderStore, s => updateStatus('purchaseOrders', s)),
        syncStore<PurchaseReturn>('purchaseReturns', '/api/purchase-returns?limit=10000', usePurchaseReturnStore, s => updateStatus('purchaseReturns', s)),
        syncStore<SalesReturn>('salesReturns', '/api/sales-returns?limit=10000', useSalesReturnStore, s => updateStatus('salesReturns', s)),
        syncStore<InventoryReceipt>('inventoryReceipts', '/api/inventory-receipts?limit=10000', useInventoryReceiptStore, s => updateStatus('inventoryReceipts', s)),
        syncStore<InventoryCheck>('inventoryChecks', '/api/inventory-checks?limit=10000', useInventoryCheckStore, s => updateStatus('inventoryChecks', s)),
        syncStore<StockLocation>('stockLocations', '/api/stock-locations?limit=10000', useStockLocationStore, s => updateStatus('stockLocations', s)),
        syncStore<Task>('tasks', '/api/tasks?limit=10000', useTaskStore, s => updateStatus('tasks', s)),

        // ============== FINANCE (Custom stores with loadFromAPI) ==============
        (async () => {
          try {
            await useCashbookStore.getState().loadFromAPI();
            console.log('[API Sync] cashbook: synced from API');
            updateStatus('cashbook', 'success');
          } catch (e) {
            console.error('[API Sync] cashbook failed:', e);
            updateStatus('cashbook', 'error');
          }
        })(),
        (async () => {
          try {
            await useReceiptStore.getState().loadFromAPI();
            console.log('[API Sync] receipts: synced from API');
            updateStatus('receipts', 'success');
          } catch (e) {
            console.error('[API Sync] receipts failed:', e);
            updateStatus('receipts', 'error');
          }
        })(),
        (async () => {
          try {
            await usePaymentStore.getState().loadFromAPI();
            console.log('[API Sync] payments: synced from API');
            updateStatus('payments', 'success');
          } catch (e) {
            console.error('[API Sync] payments failed:', e);
            updateStatus('payments', 'error');
          }
        })(),

        // ============== CUSTOM STORES WITH loadFromAPI ==============
        (async () => {
          try {
            await useStockTransferStore.getState().loadFromAPI();
            console.log('[API Sync] stockTransfers: synced from API');
            updateStatus('stockTransfers', 'success');
          } catch (e) {
            console.error('[API Sync] stockTransfers failed:', e);
            updateStatus('stockTransfers', 'error');
          }
        })(),
        (async () => {
          try {
            await useStockHistoryStore.getState().loadFromAPI();
            console.log('[API Sync] stockHistory: synced from API');
            updateStatus('stockHistory', 'success');
          } catch (e) {
            console.error('[API Sync] stockHistory failed:', e);
            updateStatus('stockHistory', 'error');
          }
        })(),
        (async () => {
          try {
            await usePayrollBatchStore.getState().loadFromAPI();
            console.log('[API Sync] payrollBatches: synced from API');
            updateStatus('payrollBatches', 'success');
          } catch (e) {
            console.error('[API Sync] payrollBatches failed:', e);
            updateStatus('payrollBatches', 'error');
          }
        })(),
        (async () => {
          try {
            await usePayrollTemplateStore.getState().loadFromAPI();
            console.log('[API Sync] payrollTemplates: synced from API');
            updateStatus('payrollTemplates', 'success');
          } catch (e) {
            console.error('[API Sync] payrollTemplates failed:', e);
            updateStatus('payrollTemplates', 'error');
          }
        })(),
        (async () => {
          try {
            await useEmployeeDocumentStore.getState().loadFromAPI();
            console.log('[API Sync] employeeDocuments: synced from API');
            updateStatus('employeeDocuments', 'success');
          } catch (e) {
            console.error('[API Sync] employeeDocuments failed:', e);
            updateStatus('employeeDocuments', 'error');
          }
        })(),
        (async () => {
          try {
            await useEmployeeCompStore.getState().loadFromAPI();
            console.log('[API Sync] employeeComp: synced from API');
            updateStatus('employeeComp', 'success');
          } catch (e) {
            console.error('[API Sync] employeeComp failed:', e);
            updateStatus('employeeComp', 'error');
          }
        })(),

        // ============== SETTINGS (CrudStore) ==============
        syncStore<Branch>('branches', '/api/branches?limit=10000', useBranchStore, s => updateStatus('branches', s)),
        syncStore<Department>('departments', '/api/departments?limit=10000', useDepartmentStore, s => updateStatus('departments', s)),
        syncStore<JobTitle>('jobTitles', '/api/job-titles?limit=10000', useJobTitleStore, s => updateStatus('jobTitles', s)),
        syncStore<Unit>('units', '/api/settings/data?type=unit&limit=10000', useUnitStore, s => updateStatus('units', s)),
        syncStore<Tax>('taxes', '/api/settings/data?type=tax&limit=10000', useTaxStore, s => updateStatus('taxes', s)),
        syncStore<SalesChannel>('salesChannels', '/api/settings/data?type=sales-channel&limit=10000', useSalesChannelStore, s => updateStatus('salesChannels', s)),
        syncStore<ShippingPartner>('shippingPartners', '/api/settings/data?type=shipping-partner&limit=10000', useShippingPartnerStore, s => updateStatus('shippingPartners', s)),
        syncStore<TargetGroup>('targetGroups', '/api/settings/data?type=target-group&limit=10000', useTargetGroupStore, s => updateStatus('targetGroups', s)),
        syncStore<ReceiptType>('receiptTypes', '/api/settings/data?type=receipt-type&limit=10000', useReceiptTypeStore, s => updateStatus('receiptTypes', s)),
        syncStore<PaymentType>('paymentTypes', '/api/settings/data?type=payment-type&limit=10000', usePaymentTypeStore, s => updateStatus('paymentTypes', s)),
        syncStore<PricingPolicy>('pricingPolicies', '/api/settings/data?type=pricing-policy&limit=10000', usePricingPolicyStore, s => updateStatus('pricingPolicies', s)),
        syncStore<Penalty>('penalties', '/api/settings/data?type=penalty&limit=10000', usePenaltyStore, s => updateStatus('penalties', s)),
        syncStore<PenaltyType>('penaltyTypes', '/api/settings/data?type=penalty-type&limit=10000', usePenaltyTypeStore, s => updateStatus('penaltyTypes', s)),

        // ============== SETTINGS (Custom stores with loadFromAPI) ==============
        (async () => {
          try {
            await usePaymentMethodStore.getState().loadFromAPI();
            console.log('[API Sync] paymentMethods: synced from API');
            updateStatus('paymentMethods', 'success');
          } catch (e) {
            console.error('[API Sync] paymentMethods failed:', e);
            updateStatus('paymentMethods', 'error');
          }
        })(),
        (async () => {
          try {
            await useAppearanceStore.getState().loadFromAPI();
            console.log('[API Sync] appearance: synced from API');
            updateStatus('appearance', 'success');
          } catch (e) {
            console.error('[API Sync] appearance failed:', e);
            updateStatus('appearance', 'error');
          }
        })(),
        (async () => {
          try {
            await useShippingSettingsStore.getState().loadFromAPI();
            console.log('[API Sync] shippingSettings: synced from API');
            updateStatus('shippingSettings', 'success');
          } catch (e) {
            console.error('[API Sync] shippingSettings failed:', e);
            updateStatus('shippingSettings', 'error');
          }
        })(),
        (async () => {
          try {
            await useEmployeeSettingsStore.getState().loadFromAPI();
            console.log('[API Sync] employeeSettings: synced from API');
            updateStatus('employeeSettings', 'success');
          } catch (e) {
            console.error('[API Sync] employeeSettings failed:', e);
            updateStatus('employeeSettings', 'error');
          }
        })(),
        (async () => {
          try {
            await useTrendtechStore.getState().loadFromAPI();
            console.log('[API Sync] trendtech: synced from API');
            updateStatus('trendtech', 'success');
          } catch (e) {
            console.error('[API Sync] trendtech failed:', e);
            updateStatus('trendtech', 'error');
          }
        })(),
        (async () => {
          try {
            await usePkgxStore.getState().loadFromAPI();
            console.log('[API Sync] pkgx: synced from API');
            updateStatus('pkgx', 'success');
          } catch (e) {
            console.error('[API Sync] pkgx failed:', e);
            updateStatus('pkgx', 'error');
          }
        })(),

        // ============== GLOBAL SETTINGS ==============
        (async () => {
          try {
            await useGlobalSettingsStore.getState().initFromAPI();
            console.log('[API Sync] settings: synced from API');
            updateStatus('settings', 'success');
          } catch (e) {
            console.error('[API Sync] settings failed:', e);
            updateStatus('settings', 'error');
          }
        })(),
      ]);

      setIsInitialized(true);
      console.log('[API Sync] ✅ All stores synced from database');
    };

    syncAll();
  }, []);

  return {
    syncState,
    isInitialized,
    isAllSynced: Object.values(syncState).every(s => s === 'success'),
    hasErrors: Object.values(syncState).some(s => s === 'error'),
  };
}
