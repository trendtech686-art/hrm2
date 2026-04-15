/**
 * Inventory Report Hooks
 * 
 * Hooks tính toán dữ liệu báo cáo tồn kho
 * Dùng dữ liệu sản phẩm (inventoryByBranch) — snapshot hiện tại, không theo date range
 */

import * as React from 'react';
import { useAllProducts } from '@/features/products/hooks/use-all-products';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import type {
  InventoryProductReportRow,
  InventoryBranchReportRow,
  InventoryCategoryReportRow,
} from '../types';
import type { SystemId } from '@/lib/id-types';

function getStockStatus(available: number, reorderLevel?: number, maxStock?: number): InventoryProductReportRow['stockStatus'] {
  if (available <= 0) return 'out_of_stock';
  if (reorderLevel && available < reorderLevel) return 'low_stock';
  if (maxStock && available > maxStock) return 'over_stock';
  return 'normal';
}

// Hook: Tồn kho theo sản phẩm
export function useInventoryProductReport(filters?: {
  branchId?: SystemId;
  categoryId?: SystemId;
  stockStatus?: string;
}) {
  const { data: products = [] } = useAllProducts();

  return React.useMemo(() => {
    const data: InventoryProductReportRow[] = products
      .filter(p => p.isStockTracked !== false)
      .map(product => {
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        const inTransitByBranch = product.inTransitByBranch || {};
        const inDeliveryByBranch = product.inDeliveryByBranch || {};

        let onHand = 0;
        let committed = 0;
        let inTransit = 0;
        let inDelivery = 0;

        if (filters?.branchId) {
          onHand = inventoryByBranch[filters.branchId] || 0;
          committed = committedByBranch[filters.branchId] || 0;
          inTransit = inTransitByBranch[filters.branchId] || 0;
          inDelivery = inDeliveryByBranch?.[filters.branchId] || 0;
        } else {
          onHand = Object.values(inventoryByBranch).reduce((sum, v) => sum + (v || 0), 0);
          committed = Object.values(committedByBranch).reduce((sum, v) => sum + (v || 0), 0);
          inTransit = Object.values(inTransitByBranch).reduce((sum, v) => sum + (v || 0), 0);
          inDelivery = Object.values(inDeliveryByBranch || {}).reduce((sum, v) => sum + (v || 0), 0);
        }

        const available = onHand - committed;
        const stockStatus = getStockStatus(available, product.reorderLevel, product.maxStock);

        return {
          productSystemId: product.systemId,
          productName: product.name,
          productCode: product.id,
          sku: product.barcode,
          categoryName: product.category,
          brandName: undefined,
          unit: product.unit || 'cái',
          onHand,
          committed,
          inTransit,
          inDelivery,
          available,
          costPrice: product.costPrice || 0,
          inventoryValue: onHand * (product.costPrice || 0),
          reorderLevel: product.reorderLevel,
          stockStatus,
        };
      })
      .filter(row => {
        if (filters?.stockStatus && row.stockStatus !== filters.stockStatus) return false;
        if (filters?.categoryId && row.categoryName === undefined) return false;
        return true;
      })
      .sort((a, b) => b.inventoryValue - a.inventoryValue);

    const summary = {
      totalProducts: data.length,
      totalOnHand: data.reduce((sum, r) => sum + r.onHand, 0),
      totalCommitted: data.reduce((sum, r) => sum + r.committed, 0),
      totalAvailable: data.reduce((sum, r) => sum + r.available, 0),
      totalInventoryValue: data.reduce((sum, r) => sum + r.inventoryValue, 0),
      outOfStockCount: data.filter(r => r.stockStatus === 'out_of_stock').length,
      lowStockCount: data.filter(r => r.stockStatus === 'low_stock').length,
    };

    return { data, summary };
  }, [products, filters]);
}

// Hook: Tồn kho theo chi nhánh
export function useInventoryBranchReport() {
  const { data: products = [] } = useAllProducts();
  const { data: branches = [] } = useAllBranches();

  return React.useMemo(() => {
    const branchMap = new Map<string, InventoryBranchReportRow>();

    branches.forEach(branch => {
      branchMap.set(branch.systemId, {
        branchSystemId: branch.systemId,
        branchName: branch.name,
        totalProducts: 0,
        totalOnHand: 0,
        totalCommitted: 0,
        totalAvailable: 0,
        totalInventoryValue: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
      });
    });

    const trackedProducts = products.filter(p => p.isStockTracked !== false);

    trackedProducts.forEach(product => {
      const inventoryByBranch = product.inventoryByBranch || {};
      const committedByBranch = product.committedByBranch || {};

      Object.entries(inventoryByBranch).forEach(([branchId, onHand]) => {
        if (!branchMap.has(branchId)) return;

        const row = branchMap.get(branchId)!;
        const committed = committedByBranch[branchId] || 0;
        const available = (onHand || 0) - committed;

        if ((onHand || 0) > 0 || committed > 0) {
          row.totalProducts += 1;
          row.totalOnHand += onHand || 0;
          row.totalCommitted += committed;
          row.totalAvailable += available;
          row.totalInventoryValue += (onHand || 0) * (product.costPrice || 0);

          if (available <= 0) row.outOfStockCount += 1;
          else if (product.reorderLevel && available < product.reorderLevel) row.lowStockCount += 1;
        }
      });
    });

    const data = Array.from(branchMap.values())
      .filter(r => r.totalProducts > 0)
      .sort((a, b) => b.totalInventoryValue - a.totalInventoryValue);

    const summary = {
      totalBranches: data.length,
      totalOnHand: data.reduce((sum, r) => sum + r.totalOnHand, 0),
      totalInventoryValue: data.reduce((sum, r) => sum + r.totalInventoryValue, 0),
      totalOutOfStock: data.reduce((sum, r) => sum + r.outOfStockCount, 0),
    };

    return { data, summary };
  }, [products, branches]);
}

// Hook: Tồn kho theo danh mục
export function useInventoryCategoryReport() {
  const { data: products = [] } = useAllProducts();

  return React.useMemo(() => {
    const categoryMap = new Map<string, InventoryCategoryReportRow>();

    const trackedProducts = products.filter(p => p.isStockTracked !== false);

    trackedProducts.forEach(product => {
      const categoryId = (product.categorySystemId || 'uncategorized') as SystemId;
      const categoryName = product.category || 'Chưa phân loại';

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categorySystemId: categoryId,
          categoryName,
          productCount: 0,
          totalOnHand: 0,
          totalCommitted: 0,
          totalAvailable: 0,
          totalInventoryValue: 0,
          outOfStockCount: 0,
        });
      }

      const row = categoryMap.get(categoryId)!;
      const inventoryByBranch = product.inventoryByBranch || {};
      const committedByBranch = product.committedByBranch || {};

      const onHand = Object.values(inventoryByBranch).reduce((sum, v) => sum + (v || 0), 0);
      const committed = Object.values(committedByBranch).reduce((sum, v) => sum + (v || 0), 0);
      const available = onHand - committed;

      row.productCount += 1;
      row.totalOnHand += onHand;
      row.totalCommitted += committed;
      row.totalAvailable += available;
      row.totalInventoryValue += onHand * (product.costPrice || 0);

      if (available <= 0 && onHand === 0) row.outOfStockCount += 1;
    });

    const data = Array.from(categoryMap.values()).sort((a, b) => b.totalInventoryValue - a.totalInventoryValue);

    const summary = {
      totalCategories: data.length,
      totalOnHand: data.reduce((sum, r) => sum + r.totalOnHand, 0),
      totalInventoryValue: data.reduce((sum, r) => sum + r.totalInventoryValue, 0),
      totalOutOfStock: data.reduce((sum, r) => sum + r.outOfStockCount, 0),
    };

    return { data, summary };
  }, [products]);
}
