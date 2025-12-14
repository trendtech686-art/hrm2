/**
 * Tests for stock-alert-utils.ts
 * ═══════════════════════════════════════════════════════════════
 */
import { describe, it, expect, beforeEach } from 'vitest';
import type { SystemId } from '@/lib/id-types';
import type { Product } from '../types';
import {
  getTotalAvailableStock,
  getTotalOnHandStock,
  getProductStockAlerts,
  getProductStockAlertsByBranch,
  getMostSevereAlert,
  needsReorder,
  isOutOfStock,
  getSuggestedOrderQuantity,
  type StockAlert,
} from '../stock-alert-utils';
import { useSlaSettingsStore } from '@/features/settings/inventory/sla-settings-store';

// Helper to create mock products
const createProduct = (overrides: Partial<Product> = {}): Product => ({
  systemId: 'prod-1' as SystemId,
  id: 'SKU001' as any,
  name: 'Test Product',
  type: 'physical',
  status: 'active',
  isDeleted: false,
  isStockTracked: true,
  unit: 'Cái',
  costPrice: 100,
  prices: {},
  inventoryByBranch: {} as Record<SystemId, number>,
  committedByBranch: {} as Record<SystemId, number>,
  inTransitByBranch: {} as Record<SystemId, number>,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const branch1 = 'branch-1' as SystemId;
const branch2 = 'branch-2' as SystemId;
const initialSlaSettings = useSlaSettingsStore.getState().settings;

const setSlaDefaults = (overrides: Partial<typeof initialSlaSettings> = {}) => {
  useSlaSettingsStore.setState(() => ({
    settings: { ...initialSlaSettings, ...overrides },
  }));
};

beforeEach(() => {
  setSlaDefaults();
});

describe('stock-alert-utils', () => {
  describe('getTotalOnHandStock', () => {
    it('sums stock across all branches', () => {
      const product = createProduct({
        inventoryByBranch: {
          [branch1]: 50,
          [branch2]: 30,
        },
      });
      expect(getTotalOnHandStock(product)).toBe(80);
    });

    it('returns 0 for empty inventory', () => {
      const product = createProduct({ inventoryByBranch: {} });
      expect(getTotalOnHandStock(product)).toBe(0);
    });
  });

  describe('getTotalAvailableStock', () => {
    it('subtracts committed from on-hand', () => {
      const product = createProduct({
        inventoryByBranch: {
          [branch1]: 50,
          [branch2]: 30,
        },
        committedByBranch: {
          [branch1]: 10,
          [branch2]: 5,
        },
      });
      // (50 + 30) - (10 + 5) = 65
      expect(getTotalAvailableStock(product)).toBe(65);
    });

    it('handles missing committed stock', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 50 },
        committedByBranch: {},
      });
      expect(getTotalAvailableStock(product)).toBe(50);
    });
  });

  describe('getProductStockAlerts', () => {
    it('returns empty for combo products', () => {
      const combo = createProduct({ type: 'combo' });
      expect(getProductStockAlerts(combo)).toEqual([]);
    });

    it('returns empty for non-stock-tracked products', () => {
      const service = createProduct({ isStockTracked: false });
      expect(getProductStockAlerts(service)).toEqual([]);
    });

    it('returns out_of_stock when available is 0', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        committedByBranch: { [branch1]: 10 },
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('out_of_stock');
      expect(alerts[0].severity).toBe('critical');
    });

    it('returns low_stock when below reorder level', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 5 },
        committedByBranch: {},
        reorderLevel: 10,
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('low_stock');
    });

    it('returns below_safety when below safety stock', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 3 },
        committedByBranch: {},
        safetyStock: 5,
        reorderLevel: 1,
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('below_safety');
    });

    it('returns over_stock when above max stock', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 100 },
        committedByBranch: {},
        maxStock: 50,
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('over_stock');
    });

    it('prioritizes out_of_stock over other alerts', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 0 },
        reorderLevel: 10,
        safetyStock: 5,
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('out_of_stock');
    });

    it('returns multiple alerts when applicable', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 3 },
        committedByBranch: {},
        reorderLevel: 10,  // low_stock (3 < 10)
        maxStock: 2,       // over_stock (3 > 2) - on-hand based
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts.some(a => a.type === 'low_stock')).toBe(true);
      expect(alerts.some(a => a.type === 'over_stock')).toBe(true);
    });

    it('falls back to global defaults when product thresholds missing', () => {
      setSlaDefaults({ defaultReorderLevel: 12, defaultSafetyStock: 6 });
      const product = createProduct({
        inventoryByBranch: { [branch1]: 5 },
        committedByBranch: {},
        reorderLevel: undefined,
        safetyStock: undefined,
      });
      const alerts = getProductStockAlerts(product);
      expect(alerts.some(a => a.type === 'low_stock')).toBe(true);
    });
  });

  describe('getProductStockAlertsByBranch', () => {
    it('returns alerts for specific branch', () => {
      const product = createProduct({
        inventoryByBranch: {
          [branch1]: 0,
          [branch2]: 50,
        },
        committedByBranch: {},
        reorderLevel: 10,
      });
      
      const alertsBranch1 = getProductStockAlertsByBranch(product, branch1, 'Chi nhánh 1');
      expect(alertsBranch1).toHaveLength(1);
      expect(alertsBranch1[0].type).toBe('out_of_stock');
      expect(alertsBranch1[0].branchSystemId).toBe(branch1);
      
      const alertsBranch2 = getProductStockAlertsByBranch(product, branch2, 'Chi nhánh 2');
      expect(alertsBranch2).toHaveLength(0); // 50 > reorderLevel
    });
  });

  describe('getMostSevereAlert', () => {
    it('returns null for empty alerts', () => {
      expect(getMostSevereAlert([])).toBeNull();
    });

    it('prioritizes critical over warning', () => {
      const alerts: StockAlert[] = [
        { type: 'low_stock', severity: 'warning', label: 'Low', description: '' },
        { type: 'out_of_stock', severity: 'critical', label: 'Out', description: '' },
      ];
      const result = getMostSevereAlert(alerts);
      expect(result?.type).toBe('out_of_stock');
    });

    it('prioritizes warning over info', () => {
      const alerts: StockAlert[] = [
        { type: 'over_stock', severity: 'info', label: 'Over', description: '' },
        { type: 'low_stock', severity: 'warning', label: 'Low', description: '' },
      ];
      const result = getMostSevereAlert(alerts);
      expect(result?.type).toBe('low_stock');
    });
  });

  describe('needsReorder', () => {
    it('returns false for combo products', () => {
      const combo = createProduct({ type: 'combo', reorderLevel: 100 });
      expect(needsReorder(combo)).toBe(false);
    });

    it('uses default reorder level when product threshold missing', () => {
      setSlaDefaults({ defaultReorderLevel: 15 });
      const product = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        reorderLevel: undefined,
      });
      expect(needsReorder(product)).toBe(true);
    });

    it('returns false if neither product nor defaults define reorder level', () => {
      setSlaDefaults({ defaultReorderLevel: undefined });
      const product = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        reorderLevel: undefined,
      });
      expect(needsReorder(product)).toBe(false);
    });

    it('returns true when available is below reorder level', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 5 },
        reorderLevel: 10,
      });
      expect(needsReorder(product)).toBe(true);
    });

    it('returns false when available is at or above reorder level', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        reorderLevel: 10,
      });
      expect(needsReorder(product)).toBe(false);
    });
  });

  describe('isOutOfStock', () => {
    it('returns false for combo products', () => {
      const combo = createProduct({ type: 'combo' });
      expect(isOutOfStock(combo)).toBe(false);
    });

    it('returns true when available is 0 or less', () => {
      const outOfStock = createProduct({
        inventoryByBranch: { [branch1]: 5 },
        committedByBranch: { [branch1]: 5 },
      });
      expect(isOutOfStock(outOfStock)).toBe(true);
    });

    it('returns false when available is positive', () => {
      const inStock = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        committedByBranch: { [branch1]: 5 },
      });
      expect(isOutOfStock(inStock)).toBe(false);
    });
  });

  describe('getSuggestedOrderQuantity', () => {
    it('returns 0 for combo products', () => {
      const combo = createProduct({ type: 'combo', safetyStock: 100 });
      expect(getSuggestedOrderQuantity(combo)).toBe(0);
    });

    it('returns 0 for non-stock-tracked products', () => {
      const service = createProduct({ isStockTracked: false, safetyStock: 100 });
      expect(getSuggestedOrderQuantity(service)).toBe(0);
    });

    it('uses default safety stock when no target level set', () => {
      setSlaDefaults({ defaultSafetyStock: 5 });
      const product = createProduct();
      expect(getSuggestedOrderQuantity(product)).toBe(5);
    });

    it('returns 0 if no target level anywhere', () => {
      setSlaDefaults({ defaultSafetyStock: undefined, defaultReorderLevel: undefined });
      const product = createProduct();
      expect(getSuggestedOrderQuantity(product)).toBe(0);
    });

    it('returns 0 if on-hand meets target', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 50 },
        safetyStock: 30,
      });
      expect(getSuggestedOrderQuantity(product)).toBe(0);
    });

    it('suggests quantity to reach safety stock', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 20 },
        safetyStock: 50,
      });
      expect(getSuggestedOrderQuantity(product)).toBe(30);
    });

    it('uses reorder level if no safety stock', () => {
      setSlaDefaults({ defaultSafetyStock: undefined });
      const product = createProduct({
        inventoryByBranch: { [branch1]: 5 },
        reorderLevel: 25,
      });
      expect(getSuggestedOrderQuantity(product)).toBe(20);
    });

    it('prefers safety stock over reorder level', () => {
      const product = createProduct({
        inventoryByBranch: { [branch1]: 10 },
        safetyStock: 50,
        reorderLevel: 30,
      });
      expect(getSuggestedOrderQuantity(product)).toBe(40); // 50 - 10
    });
  });
});
