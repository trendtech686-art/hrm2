/**
 * Script to find all usages of deprecated Zustand stores
 * Run: npx tsx scripts/find-store-usages.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface StoreUsage {
  storeName: string;
  storeFile: string;
  replacement: string;
  usages: { file: string; line: number; text: string }[];
}

const DEPRECATED_STORES: { name: string; file: string; replacement: string }[] = [
  // HIGH PRIORITY - Many usages
  { 
    name: 'useEmployeeStore', 
    file: 'features/employees/store.ts',
    replacement: 'useAllEmployees, useEmployee, useEmployeeMutations from @/features/employees/hooks/use-employees'
  },
  { 
    name: 'useProductStore', 
    file: 'features/products/store.ts',
    replacement: 'useAllProducts, useProduct, useProductMutations from @/features/products/hooks/use-products'
  },
  { 
    name: 'useStockHistoryStore', 
    file: 'features/stock-history/store.ts',
    replacement: 'useStockHistory, useProductStockHistory, useStockHistoryMutations from @/features/stock-history/hooks/use-stock-history'
  },
  
  // SETTINGS STORES
  { 
    name: 'useBranchStore', 
    file: 'features/settings/branches/store.ts',
    replacement: 'useAllBranches, useBranchMutations from @/features/settings/branches/hooks/use-all-branches'
  },
  { 
    name: 'useProvinceStore', 
    file: 'features/settings/provinces/store.ts',
    replacement: 'useProvinces, useDistricts, useWards from @/features/settings/provinces/hooks/use-provinces'
  },
  { 
    name: 'useSupplierStore', 
    file: 'features/suppliers/store.ts',
    replacement: 'useAllSuppliers, useSupplierMutations from @/features/suppliers/hooks/use-all-suppliers'
  },
  { 
    name: 'useCustomerStore', 
    file: 'features/customers/store.ts',
    replacement: 'useAllCustomers, useCustomerMutations from @/features/customers/hooks/use-all-customers'
  },
  { 
    name: 'useWarrantyStore', 
    file: 'features/warranty/store/index.ts',
    replacement: 'useAllWarranties, useWarrantyMutations from @/features/warranty/hooks/use-warranties'
  },
  
  // INVENTORY STORES  
  { 
    name: 'useInventoryCheckStore', 
    file: 'features/inventory-checks/store/index.ts',
    replacement: 'useAllInventoryChecks, useInventoryCheckMutations from @/features/inventory-checks/hooks/use-inventory-checks'
  },
  { 
    name: 'useInventoryReceiptStore', 
    file: 'features/inventory-receipts/store.ts',
    replacement: 'useInventoryReceipts, useInventoryReceiptMutations from @/features/inventory-receipts/hooks/use-inventory-receipts'
  },
  { 
    name: 'useStockTransferStore', 
    file: 'features/stock-transfers/store/index.ts',
    replacement: 'useAllStockTransfers, useStockTransferMutations from @/features/stock-transfers/hooks/use-stock-transfers'
  },
  { 
    name: 'useStockLocationStore', 
    file: 'features/stock-locations/store.ts',
    replacement: 'useStockLocations from @/features/stock-locations/hooks/use-stock-locations'
  },
  
  // ORDER-RELATED STORES
  { 
    name: 'useOrderStore', 
    file: 'features/orders/store.ts',
    replacement: 'useAllOrders, useOrderMutations from @/features/orders/hooks/use-orders'
  },
  { 
    name: 'usePurchaseOrderStore', 
    file: 'features/purchase-orders/store/index.ts',
    replacement: 'useAllPurchaseOrders, usePurchaseOrderMutations from @/features/purchase-orders/hooks/use-purchase-orders'
  },
  { 
    name: 'usePurchaseReturnStore', 
    file: 'features/purchase-returns/store.ts',
    replacement: 'useAllPurchaseReturns, usePurchaseReturnMutations from @/features/purchase-returns/hooks/use-purchase-returns'
  },
  { 
    name: 'useSalesReturnStore', 
    file: 'features/sales-returns/store/index.ts',
    replacement: 'useAllSalesReturns, useSalesReturnMutations from @/features/sales-returns/hooks/use-sales-returns'
  },
  
  // FINANCE STORES
  { 
    name: 'useCashbookStore', 
    file: 'features/cashbook/store.ts',
    replacement: 'useCashAccounts, useCashbookMutations from @/features/cashbook/hooks/use-cashbook'
  },
  { 
    name: 'useReceiptStore', 
    file: 'features/receipts/store/index.ts',
    replacement: 'useReceipts, useReceiptMutations from @/features/receipts/hooks/use-receipts'
  },
  { 
    name: 'usePaymentStore', 
    file: 'features/payments/store/index.ts',
    replacement: 'usePayments, usePaymentMutations from @/features/payments/hooks/use-payments'
  },
  
  // HR STORES
  { 
    name: 'useAttendanceStore', 
    file: 'features/attendance/store.ts',
    replacement: 'useAttendance, useAttendanceMutations from @/features/attendance/hooks/use-attendance'
  },
  { 
    name: 'useLeaveStore', 
    file: 'features/leaves/store.ts',
    replacement: 'useLeaves, useLeaveMutations from @/features/leaves/hooks/use-leaves'
  },
  { 
    name: 'usePayrollBatchStore', 
    file: 'features/payroll/payroll-batch-store.ts',
    replacement: 'usePayrollBatches from @/features/payroll/hooks/use-payroll'
  },
  { 
    name: 'usePayrollTemplateStore', 
    file: 'features/payroll/payroll-template-store.ts',
    replacement: 'usePayrollTemplates from @/features/payroll/hooks/use-payroll'
  },
  
  // OTHER STORES
  { 
    name: 'useTaskStore', 
    file: 'features/tasks/store.ts',
    replacement: 'useTasks, useTaskMutations from @/features/tasks/hooks/use-tasks'
  },
  { 
    name: 'useComplaintStore', 
    file: 'features/complaints/store/index.ts',
    replacement: 'useComplaints, useComplaintMutations from @/features/complaints/hooks/use-complaints'
  },
  { 
    name: 'useShipmentStore', 
    file: 'features/shipments/store/index.ts',
    replacement: 'useShipments, useShipmentMutations from @/features/shipments/hooks/use-shipments'
  },
  { 
    name: 'useWikiStore', 
    file: 'features/wiki/store.ts',
    replacement: 'useWikiArticles, useWikiMutations from @/features/wiki/hooks/use-wiki'
  },
  { 
    name: 'useAuditLogStore', 
    file: 'features/audit-log/store.ts',
    replacement: 'useAuditLogs from @/features/audit-log/hooks/use-audit-log'
  },
  { 
    name: 'useCostAdjustmentStore', 
    file: 'features/cost-adjustments/store/index.ts',
    replacement: 'useCostAdjustments, useCostAdjustmentMutations from @/features/cost-adjustments/hooks/use-cost-adjustments'
  },
];

function findUsages(storeName: string): { file: string; line: number; text: string }[] {
  const usages: { file: string; line: number; text: string }[] = [];
  
  try {
    // Use grep to find usages
    const result = execSync(
      `findstr /S /N /C:"${storeName}" *.ts *.tsx 2>nul`,
      { 
        cwd: path.join(process.cwd()),
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024
      }
    );
    
    const lines = result.split('\n').filter(Boolean);
    for (const line of lines) {
      // Format: filename:lineNumber:content
      const match = line.match(/^(.+?):(\d+):(.*)$/);
      if (match) {
        const [, file, lineNum, text] = match;
        // Skip the store definition file itself
        if (!file.includes('store.ts') && !file.includes('store/index.ts')) {
          // Skip eslint/test files
          if (!file.includes('eslint') && !file.includes('.test.') && !file.includes('.spec.')) {
            usages.push({
              file: file.trim(),
              line: parseInt(lineNum, 10),
              text: text.trim().substring(0, 100)
            });
          }
        }
      }
    }
  } catch {
    // No matches found or error
  }
  
  return usages;
}

function main() {
  console.log('🔍 Scanning for deprecated Zustand store usages...\n');
  
  const results: StoreUsage[] = [];
  let totalUsages = 0;
  
  for (const store of DEPRECATED_STORES) {
    const usages = findUsages(store.name);
    totalUsages += usages.length;
    
    results.push({
      storeName: store.name,
      storeFile: store.file,
      replacement: store.replacement,
      usages
    });
  }
  
  // Sort by number of usages (highest first)
  results.sort((a, b) => b.usages.length - a.usages.length);
  
  // Print summary
  console.log('=' .repeat(80));
  console.log('📊 ZUSTAND STORE MIGRATION SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Total deprecated stores: ${DEPRECATED_STORES.length}`);
  console.log(`Total usages to update: ${totalUsages}`);
  console.log('');
  
  // Print by priority
  console.log('🔴 HIGH PRIORITY (10+ usages):');
  console.log('-'.repeat(40));
  for (const r of results.filter(r => r.usages.length >= 10)) {
    console.log(`  ${r.storeName}: ${r.usages.length} usages`);
    console.log(`    → Replace with: ${r.replacement}`);
  }
  
  console.log('\n🟡 MEDIUM PRIORITY (1-9 usages):');
  console.log('-'.repeat(40));
  for (const r of results.filter(r => r.usages.length >= 1 && r.usages.length < 10)) {
    console.log(`  ${r.storeName}: ${r.usages.length} usages`);
  }
  
  console.log('\n🟢 LOW PRIORITY (0 usages - can delete):');
  console.log('-'.repeat(40));
  for (const r of results.filter(r => r.usages.length === 0)) {
    console.log(`  ${r.storeName}`);
    console.log(`    File: ${r.storeFile}`);
  }
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), 'store-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Print files that need updating (grouped by store)
  console.log('\n' + '='.repeat(80));
  console.log('📝 FILES NEEDING UPDATES (by store)');
  console.log('='.repeat(80));
  
  for (const r of results.filter(r => r.usages.length > 0)) {
    console.log(`\n${r.storeName} (${r.usages.length} files):`);
    console.log(`Replace with: ${r.replacement}`);
    const uniqueFiles = [...new Set(r.usages.map(u => u.file))];
    for (const file of uniqueFiles.slice(0, 10)) {
      console.log(`  - ${file}`);
    }
    if (uniqueFiles.length > 10) {
      console.log(`  ... and ${uniqueFiles.length - 10} more files`);
    }
  }
}

main();
