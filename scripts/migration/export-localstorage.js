/**
 * SCRIPT EXPORT LOCALSTORAGE TO JSON FILES
 * 
 * Cách sử dụng:
 * 1. Mở hrm2 trên browser (http://localhost:5173)
 * 2. Mở DevTools (F12) > Console
 * 3. Copy và paste toàn bộ code này vào console
 * 4. Nhấn Enter
 * 5. Các file JSON sẽ được download tự động
 * 
 * Hoặc chạy qua Node.js với puppeteer nếu cần automation
 */

(function exportLocalStorage() {
  console.log('🚀 Starting localStorage export...');
  
  // Danh sách các store keys trong localStorage
  const storeKeys = [
    // Core
    'employees-storage',
    'customers-storage', 
    'products-storage',
    'orders-storage',
    
    // HR
    'attendance-storage',
    'leaves-storage',
    
    // Finance
    'cashbook-storage',
    'payments-storage',
    'receipts-storage',
    
    // Inventory
    'stock-locations-storage',
    'stock-transfers-storage',
    'stock-history-storage',
    'inventory-checks-storage',
    'inventory-receipts-storage',
    'cost-adjustments-storage',
    
    // Procurement
    'suppliers-storage',
    'purchase-orders-storage',
    'purchase-returns-storage',
    
    // Sales
    'sales-returns-storage',
    'shipments-storage',
    
    // Operations
    'tasks-storage',
    'complaints-storage',
    'warranty-storage',
    'warranty-types-storage',
    'wiki-storage',
    'audit-log-storage',
    
    // Settings
    'branches-storage',
    'departments-storage',
    'job-titles-storage',
    'payment-methods-storage',
    'payment-types-storage',
    'receipt-types-storage',
    'taxes-storage',
    'units-storage',
    'pricing-storage',
    'shipping-settings-storage',
    'printer-settings-storage',
    'appearance-storage',
    'provinces-storage',
    'sales-channels-storage',
    'target-groups-storage',
    'penalties-storage',
    'pkgx-storage',
    'trendtech-storage',
    'store-info-storage',
    
    // Categories & Brands
    'categories-storage',
    'brands-storage',
    
    // Customer SLA
    'customer-sla-storage',
  ];
  
  const exportData = {};
  let foundCount = 0;
  let totalRecords = 0;
  
  // Collect all localStorage data
  storeKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        exportData[key] = parsed;
        foundCount++;
        
        // Count records if it's an array or has data property
        if (parsed.state?.data && Array.isArray(parsed.state.data)) {
          totalRecords += parsed.state.data.length;
          console.log(`✅ ${key}: ${parsed.state.data.length} records`);
        } else if (Array.isArray(parsed)) {
          totalRecords += parsed.length;
          console.log(`✅ ${key}: ${parsed.length} records`);
        } else {
          console.log(`✅ ${key}: found (object)`);
        }
      } catch (e) {
        console.error(`❌ Error parsing ${key}:`, e);
      }
    }
  });
  
  // Also export any other localStorage keys that might exist
  console.log('\n📦 Checking for additional localStorage keys...');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!storeKeys.includes(key) && key.includes('storage')) {
      const data = localStorage.getItem(key);
      try {
        exportData[key] = JSON.parse(data);
        console.log(`📦 Found additional: ${key}`);
        foundCount++;
      } catch (e) {
        // Skip non-JSON data
      }
    }
  }
  
  console.log(`\n📊 Summary: Found ${foundCount} stores with ~${totalRecords} total records`);
  
  // Create download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hrm2-data-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('\n✅ Export completed! Check your downloads folder.');
  console.log('📁 File: hrm2-data-export-' + new Date().toISOString().split('T')[0] + '.json');
  
  return exportData;
})();
