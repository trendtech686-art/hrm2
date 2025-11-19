import { useCallback, useRef } from 'react';

/**
 * Route Prefetch Hook
 * Prefetch lazy-loaded routes before user navigates to improve perceived performance
 * 
 * Usage:
 * const prefetch = useRoutePrefetch();
 * <MenuItem onMouseEnter={() => prefetch('/leaves')}>Nghỉ phép</MenuItem>
 */

interface PrefetchCache {
  [key: string]: {
    loading: boolean;
    loaded: boolean;
    error?: Error;
  };
}

export function useRoutePrefetch() {
  const cacheRef = useRef<PrefetchCache>({});

  const prefetch = useCallback((routePath: string) => {
    // Already loaded or loading
    if (cacheRef.current[routePath]?.loaded || cacheRef.current[routePath]?.loading) {
      return;
    }

    // Mark as loading
    cacheRef.current[routePath] = { loading: true, loaded: false };

    // Map route paths to their component imports
    const routeImportMap: Record<string, () => Promise<any>> = {
      // HRM Routes
      '/attendance': () => import('../features/attendance/page'),
      '/leaves': () => import('../features/leaves/page'),
      // '/payroll': () => import('../features/payroll/page'), // TODO: Create page
      // '/kpi': () => import('../features/kpi/page'), // TODO: Create page
      // '/organization-chart': () => import('../features/departments/organization-chart/page'), // TODO: Create page
      
      // Sales Routes
      '/products/new': () => import('../features/products/form-page'),
      '/orders/new': () => import('../features/orders/order-form-page'),
      '/returns': () => import('../features/sales-returns/page'),
      
      // Procurement Routes
      '/suppliers': () => import('../features/suppliers/page'),
      '/purchase-orders': () => import('../features/purchase-orders/page'),
      '/inventory-receipts': () => import('../features/inventory-receipts/page'),
      
      // Finance Routes
      '/cashbook': () => import('../features/cashbook/page'),
      '/receipts': () => import('../features/receipts/page'),
      '/payments': () => import('../features/payments/page'),
      
      // Internal Operations
      '/packaging': () => import('../features/packaging/page'),
      '/shipments': () => import('../features/shipments/page'),
      '/reconciliation': () => import('../features/reconciliation/page'),
      '/warranty': () => import('../features/warranty/warranty-list-page'),
      // '/internal-tasks': () => import('../features/internal-tasks/page'), // TODO: Create page
      '/complaints': () => import('../features/complaints/page'),
      // '/penalties': () => import('../features/penalties/page'), // TODO: Create page
      // '/duty-schedule': () => import('../features/duty-schedule/page'), // TODO: Create page
      '/wiki': () => import('../features/wiki/page'),
      
      // Reports
      '/reports/sales': () => import('../features/reports/sales-report/page'),
      '/reports/inventory': () => import('../features/reports/inventory-report/page'),
      
      // Settings
      '/settings': () => import('../features/settings/page'),
      '/settings/appearance': () => import('../features/settings/appearance/appearance-page'),
      '/settings/store-info': () => import('../features/settings/store-info/store-info-page'),
      '/settings/id-counters': () => import('../features/settings/system/id-counter-settings-page'), // ✅ NEW
    };

    const importFn = routeImportMap[routePath];
    
    if (!importFn) {
      // Route not found in map, mark as loaded to avoid retrying
      cacheRef.current[routePath] = { loading: false, loaded: true };
      return;
    }

    // Start prefetch
    importFn()
      .then(() => {
        cacheRef.current[routePath] = { loading: false, loaded: true };
        console.log(`[Prefetch] ✅ Loaded: ${routePath}`);
      })
      .catch((error) => {
        cacheRef.current[routePath] = { loading: false, loaded: false, error };
        console.error(`[Prefetch] ❌ Failed: ${routePath}`, error);
      });
  }, []);

  return prefetch;
}

/**
 * Preload critical routes when browser is idle
 * Call this in App.tsx or main layout
 */
export function useIdlePreload(routes: string[]) {
  const prefetch = useRoutePrefetch();

  React.useEffect(() => {
    // Wait for browser to be idle before preloading
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => {
        console.log('[Prefetch] 🚀 Starting idle preload...');
        routes.forEach(route => {
          setTimeout(() => prefetch(route), Math.random() * 1000); // Stagger loads
        });
      }, { timeout: 3000 });

      return () => cancelIdleCallback(handle);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        routes.forEach(route => {
          setTimeout(() => prefetch(route), Math.random() * 1000);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [prefetch, routes]);
}

// Fix: Import React
import * as React from 'react';
