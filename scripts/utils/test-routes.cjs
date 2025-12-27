/**
 * Script to test all 105 routes in the Next.js app
 * Run with: node scripts/test-routes.cjs
 */

const http = require('http');

// Routes without dynamic params (can test directly)
const staticRoutes = [
  '/dashboard',
  '/attendance',
  '/brands',
  '/brands/new',
  '/cashbook',
  '/cashbook/reports',
  '/categories',
  '/categories/new',
  '/complaints',
  '/complaints/new',
  '/cost-adjustments',
  '/cost-adjustments/new',
  '/customers',
  '/customers/new',
  '/departments',
  '/departments/new',
  '/employees',
  '/employees/new',
  '/inventory-checks',
  '/inventory-checks/new',
  '/inventory-receipts',
  '/leaves',
  '/orders',
  '/orders/new',
  '/organization-chart',
  '/packaging',
  '/payments',
  '/payments/new',
  '/payroll',
  '/payroll/run',
  '/payroll/templates',
  '/penalties',
  '/penalties/new',
  '/products',
  '/products/new',
  '/products/trash',
  '/purchase-orders',
  '/purchase-orders/new',
  '/purchase-returns',
  '/purchase-returns/new',
  '/receipts',
  '/receipts/new',
  '/reconciliation',
  '/reports',
  '/sales-returns',
  '/settings',
  '/shipments',
  '/stock-locations',
  '/stock-transfers',
  '/stock-transfers/new',
  '/suppliers',
  '/suppliers/new',
  '/suppliers/trash',
  '/tasks',
  '/tasks/new',
  '/tasks/calendar',
  '/warranty',
  '/warranty/new',
  '/warranty/statistics',
  '/wiki',
  '/wiki/new',
];

// Routes with dynamic params (test with sample ID)
const dynamicRoutes = [
  '/brands/1',
  '/brands/1/edit',
  '/categories/1',
  '/categories/1/edit',
  '/complaints/1',
  '/complaints/1/edit',
  '/cost-adjustments/1',
  '/customers/1',
  '/customers/1/edit',
  '/departments/1/edit',
  '/employees/1',
  '/employees/1/edit',
  '/inventory-checks/1',
  '/inventory-checks/1/edit',
  '/inventory-receipts/1',
  '/leaves/1',
  '/orders/1',
  '/orders/1/edit',
  '/packaging/1',
  '/payments/1',
  '/payments/1/edit',
  '/payroll/1',
  '/penalties/1',
  '/penalties/1/edit',
  '/products/1',
  '/products/1/edit',
  '/purchase-orders/1',
  '/purchase-orders/1/edit',
  '/purchase-returns/1',
  '/receipts/1',
  '/receipts/1/edit',
  '/sales-returns/1',
  '/shipments/1',
  '/stock-transfers/1',
  '/stock-transfers/1/edit',
  '/suppliers/1',
  '/suppliers/1/edit',
  '/tasks/1',
  '/tasks/1/edit',
  '/warranty/1',
  '/warranty/1/edit',
  '/warranty/1/update',
  '/wiki/1',
  '/wiki/1/edit',
];

const allRoutes = [...staticRoutes, ...dynamicRoutes];

const results = {
  success: [],
  failed: [],
  errors: [],
};

async function testRoute(route) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(`http://localhost:3000${route}`, (res) => {
      const duration = Date.now() - startTime;
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        // Check for compile errors in response
        const hasError = body.includes('Server Error') || 
                        body.includes('Unhandled Runtime Error') ||
                        body.includes('Module not found') ||
                        body.includes('Cannot find module') ||
                        res.statusCode >= 500;
        
        if (hasError) {
          // Extract error message if possible
          const errorMatch = body.match(/Error:([^<]+)/);
          const errorMsg = errorMatch ? errorMatch[1].trim().substring(0, 100) : `Status ${res.statusCode}`;
          resolve({ route, success: false, duration, error: errorMsg });
        } else {
          resolve({ route, success: true, duration, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({ route, success: false, duration: 0, error: err.message });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ route, success: false, duration: 30000, error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🚀 Testing all routes...\n');
  console.log(`Total routes to test: ${allRoutes.length}\n`);
  
  let completed = 0;
  
  for (const route of allRoutes) {
    const result = await testRoute(route);
    completed++;
    
    if (result.success) {
      results.success.push(result);
      console.log(`✅ [${completed}/${allRoutes.length}] ${route} (${result.duration}ms)`);
    } else {
      results.failed.push(result);
      console.log(`❌ [${completed}/${allRoutes.length}] ${route} - ${result.error}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Success Rate: ${((results.success.length / allRoutes.length) * 100).toFixed(1)}%`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Routes:');
    results.failed.forEach(r => {
      console.log(`   - ${r.route}: ${r.error}`);
    });
  }
  
  console.log('\n');
}

// Check if dev server is running
http.get('http://localhost:3000', (res) => {
  runTests();
}).on('error', () => {
  console.log('❌ Dev server not running! Please start with: npm run dev');
  process.exit(1);
});
