/**
 * Tests for combo-utils.ts
 * ═══════════════════════════════════════════════════════════════
 */
import { describe, it, expect } from 'vitest';
import type { SystemId } from '@/lib/id-types';
import type { Product, ComboItem, ComboPricingType } from '../types';
import {
  isComboProduct,
  canAddToCombo,
  validateComboItems,
  calculateComboStock,
  calculateComboStockAllBranches,
  calculateComboPrice,
  calculateComboCostPrice,
  calculateComboPricesByPolicy,
  calculateFinalComboPricesByPolicy,
  getComboBottleneckProducts,
  hasComboStock,
  MAX_COMBO_ITEMS,
  MIN_COMBO_ITEMS,
} from '../combo-utils';

// Helper to create mock products
const createProduct = (overrides: Partial<Product> = {}): Product => ({
  systemId: 'prod-1' as SystemId,
  id: 'SKU001' as any,
  name: 'Test Product',
  type: 'physical',
  status: 'active',
  isDeleted: false,
  unit: 'Cái',
  costPrice: 100,
  prices: { 'policy-1': 200 } as Record<string, number>,
  inventoryByBranch: { 'branch-1': 50 } as Record<SystemId, number>,
  committedByBranch: { 'branch-1': 10 } as Record<SystemId, number>,
  inTransitByBranch: {} as Record<SystemId, number>,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Helper to create combo items
const createComboItem = (productSystemId: string, quantity: number): ComboItem => ({
  productSystemId: productSystemId as SystemId,
  quantity,
});

describe('combo-utils', () => {
  describe('isComboProduct', () => {
    it('returns true for combo products', () => {
      const combo = createProduct({ type: 'combo' });
      expect(isComboProduct(combo)).toBe(true);
    });

    it('returns false for non-combo products', () => {
      expect(isComboProduct(createProduct({ type: 'physical' }))).toBe(false);
      expect(isComboProduct(createProduct({ type: 'service' }))).toBe(false);
      expect(isComboProduct(createProduct({ type: 'digital' }))).toBe(false);
    });
  });

  describe('canAddToCombo', () => {
    it('returns false for combo products', () => {
      const combo = createProduct({ type: 'combo' });
      expect(canAddToCombo(combo)).toBe(false);
    });

    it('returns false for discontinued products', () => {
      const discontinued = createProduct({ status: 'discontinued' });
      expect(canAddToCombo(discontinued)).toBe(false);
    });

    it('returns false for deleted products', () => {
      const deleted = createProduct({ isDeleted: true });
      expect(canAddToCombo(deleted)).toBe(false);
    });

    it('returns true for active physical/service products', () => {
      expect(canAddToCombo(createProduct({ type: 'physical' }))).toBe(true);
      expect(canAddToCombo(createProduct({ type: 'service' }))).toBe(true);
    });
  });

  describe('validateComboItems', () => {
    const products = [
      createProduct({ systemId: 'prod-1' as SystemId }),
      createProduct({ systemId: 'prod-2' as SystemId }),
      createProduct({ systemId: 'prod-3' as SystemId }),
    ];

    it('returns error if less than MIN_COMBO_ITEMS', () => {
      const items = [createComboItem('prod-1', 1)];
      const error = validateComboItems(items, products);
      expect(error).toContain(MIN_COMBO_ITEMS.toString());
    });

    it('returns error if more than MAX_COMBO_ITEMS', () => {
      const items = Array.from({ length: MAX_COMBO_ITEMS + 1 }, (_, i) => 
        createComboItem(`prod-${i}`, 1)
      );
      const productsMany = items.map((_, i) => 
        createProduct({ systemId: `prod-${i}` as SystemId })
      );
      const error = validateComboItems(items, productsMany);
      expect(error).toContain(MAX_COMBO_ITEMS.toString());
    });

    it('returns error for duplicate products', () => {
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('prod-1', 2),
      ];
      const error = validateComboItems(items, products);
      expect(error).toContain('trùng lặp');
    });

    it('returns error for invalid quantity', () => {
      const items = [
        createComboItem('prod-1', 0),
        createComboItem('prod-2', 1),
      ];
      const error = validateComboItems(items, products);
      expect(error).toContain('>= 1');
    });

    it('returns error for non-existent product', () => {
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('non-existent', 1),
      ];
      const error = validateComboItems(items, products);
      expect(error).toContain('không tồn tại');
    });

    it('returns null for valid combo', () => {
      const items = [
        createComboItem('prod-1', 2),
        createComboItem('prod-2', 1),
      ];
      const error = validateComboItems(items, products);
      expect(error).toBeNull();
    });
  });

  describe('calculateComboStock', () => {
    const branchId = 'branch-1' as SystemId;
    
    it('returns 0 for empty combo items', () => {
      expect(calculateComboStock([], [], branchId)).toBe(0);
    });

    it('calculates stock based on minimum available', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          inventoryByBranch: { [branchId]: 100 },
          committedByBranch: { [branchId]: 0 },
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          inventoryByBranch: { [branchId]: 50 },
          committedByBranch: { [branchId]: 10 },
        }),
      ];
      const items = [
        createComboItem('prod-1', 2), // 100/2 = 50 combos
        createComboItem('prod-2', 4), // (50-10)/4 = 10 combos
      ];
      
      expect(calculateComboStock(items, products, branchId)).toBe(10);
    });

    it('returns 0 if any product is missing', () => {
      const products = [
        createProduct({ systemId: 'prod-1' as SystemId }),
      ];
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('prod-2', 1), // Not in products array
      ];
      
      expect(calculateComboStock(items, products, branchId)).toBe(0);
    });

    it('considers committed stock', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          inventoryByBranch: { [branchId]: 50 },
          committedByBranch: { [branchId]: 50 }, // All committed
        }),
      ];
      const items = [createComboItem('prod-1', 1)];
      
      expect(calculateComboStock(items, products, branchId)).toBe(0);
    });
  });

  describe('calculateComboStockAllBranches', () => {
    it('calculates stock for all branches', () => {
      const branch1 = 'branch-1' as SystemId;
      const branch2 = 'branch-2' as SystemId;
      
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          inventoryByBranch: { [branch1]: 20, [branch2]: 30 },
          committedByBranch: {},
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          inventoryByBranch: { [branch1]: 10, [branch2]: 15 },
          committedByBranch: {},
        }),
      ];
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('prod-2', 1),
      ];
      
      const result = calculateComboStockAllBranches(items, products);
      expect(result[branch1]).toBe(10); // min(20, 10)
      expect(result[branch2]).toBe(15); // min(30, 15)
    });
  });

  describe('calculateComboPrice', () => {
    const policyId = 'policy-1' as SystemId;
    
    const products = [
      createProduct({
        systemId: 'prod-1' as SystemId,
        prices: { [policyId]: 100000 },
      }),
      createProduct({
        systemId: 'prod-2' as SystemId,
        prices: { [policyId]: 50000 },
      }),
    ];
    const items = [
      createComboItem('prod-1', 2), // 2 x 100000 = 200000
      createComboItem('prod-2', 1), // 1 x 50000 = 50000
    ]; // Total = 250000

    it('returns fixed price when comboPricingType is fixed', () => {
      const price = calculateComboPrice(items, products, policyId, 'fixed', 199000);
      expect(price).toBe(199000);
    });

    it('applies percentage discount', () => {
      const price = calculateComboPrice(items, products, policyId, 'sum_discount_percent', 10);
      expect(price).toBe(225000); // 250000 - 10% = 225000
    });

    it('applies fixed amount discount', () => {
      const price = calculateComboPrice(items, products, policyId, 'sum_discount_amount', 50000);
      expect(price).toBe(200000); // 250000 - 50000 = 200000
    });
  });

  describe('calculateComboCostPrice', () => {
    it('sums cost prices of child products', () => {
      const products = [
        createProduct({ systemId: 'prod-1' as SystemId, costPrice: 100 }),
        createProduct({ systemId: 'prod-2' as SystemId, costPrice: 50 }),
      ];
      const items = [
        createComboItem('prod-1', 2), // 2 x 100
        createComboItem('prod-2', 3), // 3 x 50
      ];
      
      expect(calculateComboCostPrice(items, products)).toBe(350);
    });

    it('handles missing cost price', () => {
      const products = [
        createProduct({ systemId: 'prod-1' as SystemId, costPrice: Number.NaN }),
      ];
      const items = [createComboItem('prod-1', 1)];
      
      expect(
        calculateComboCostPrice(items, products, { allowPriceFallback: false })
      ).toBe(0);
    });

    it('falls back to last purchase, then pricing policy, then min price', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          costPrice: Number.NaN,
          lastPurchasePrice: 80,
          minPrice: 70,
          prices: { 'policy-1': 200 },
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          costPrice: Number.NaN,
          lastPurchasePrice: undefined,
          minPrice: 60,
          prices: { 'policy-1': 150 },
        }),
        createProduct({
          systemId: 'prod-3' as SystemId,
          costPrice: Number.NaN,
          lastPurchasePrice: undefined,
          minPrice: 40,
          prices: {},
        }),
      ];
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('prod-2', 2),
        createComboItem('prod-3', 3),
      ];

      // prod-1 uses lastPurchasePrice (80), prod-2 uses policy price (150), prod-3 uses minPrice (40)
      expect(calculateComboCostPrice(items, products)).toBe(80 + (150 * 2) + (40 * 3));
    });

    it('falls back to selling price when cost data is missing', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          costPrice: Number.NaN,
          lastPurchasePrice: undefined,
          minPrice: undefined,
          prices: { 'policy-1': 120 },
        }),
      ];
      const items = [createComboItem('prod-1', 2)];

      expect(
        calculateComboCostPrice(items, products, { fallbackPricingPolicyId: 'policy-1' as SystemId })
      ).toBe(240);
    });
  });

  describe('calculateComboPricesByPolicy', () => {
    it('calculates sum of prices for each policy', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          prices: { 'policy-1': 100, 'policy-2': 120 },
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          prices: { 'policy-1': 50, 'policy-2': 60 },
        }),
      ];
      const items = [
        createComboItem('prod-1', 2),
        createComboItem('prod-2', 1),
      ];
      
      const result = calculateComboPricesByPolicy(items, products);
      expect(result['policy-1']).toBe(250); // 2x100 + 1x50
      expect(result['policy-2']).toBe(300); // 2x120 + 1x60
    });
  });

  describe('calculateFinalComboPricesByPolicy', () => {
    const products = [
      createProduct({
        systemId: 'prod-1' as SystemId,
        prices: { 'policy-1': 100, 'policy-2': 200 },
      }),
      createProduct({
        systemId: 'prod-2' as SystemId,
        prices: { 'policy-1': 50, 'policy-2': 100 },
      }),
    ];
    const items = [
      createComboItem('prod-1', 1),
      createComboItem('prod-2', 1),
    ]; // Sum: policy-1=150, policy-2=300

    it('applies fixed price to all policies', () => {
      const result = calculateFinalComboPricesByPolicy(items, products, 'fixed', 99, 'policy-1');
      expect(result['policy-1']).toBe(99);
      expect(result['policy-2']).toBe(99);
    });

    it('does not auto-fill policies without child pricing data', () => {
      const result = calculateFinalComboPricesByPolicy(items, products, 'fixed', 150, 'policy-999');
      expect(result['policy-1']).toBe(150);
      expect(result['policy-2']).toBe(150);
      expect(result['policy-999']).toBeUndefined();
    });

    it('applies percentage discount per policy', () => {
      const result = calculateFinalComboPricesByPolicy(items, products, 'sum_discount_percent', 10);
      expect(result['policy-1']).toBe(135); // 150 - 10%
      expect(result['policy-2']).toBe(270); // 300 - 10%
    });

    it('applies fixed amount discount per policy', () => {
      const result = calculateFinalComboPricesByPolicy(items, products, 'sum_discount_amount', 50);
      expect(result['policy-1']).toBe(100); // 150 - 50
      expect(result['policy-2']).toBe(250); // 300 - 50
    });
  });

  describe('hasComboStock', () => {
    const branchId = 'branch-1' as SystemId;
    const products = [
      createProduct({
        systemId: 'prod-1' as SystemId,
        inventoryByBranch: { [branchId]: 10 },
        committedByBranch: {},
      }),
    ];
    const items = [createComboItem('prod-1', 1)]; // 10 combos available

    it('returns true if stock is sufficient', () => {
      expect(hasComboStock(items, products, branchId, 5)).toBe(true);
      expect(hasComboStock(items, products, branchId, 10)).toBe(true);
    });

    it('returns false if stock is insufficient', () => {
      expect(hasComboStock(items, products, branchId, 11)).toBe(false);
    });
  });

  describe('getComboBottleneckProducts', () => {
    const branchId = 'branch-1' as SystemId;
    
    it('identifies limiting product', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          name: 'Abundant Product',
          inventoryByBranch: { [branchId]: 100 },
          committedByBranch: {},
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          name: 'Scarce Product',
          inventoryByBranch: { [branchId]: 5 },
          committedByBranch: {},
        }),
      ];
      const items = [
        createComboItem('prod-1', 1), // 100 combos
        createComboItem('prod-2', 1), // 5 combos - bottleneck
      ];
      
      const bottlenecks = getComboBottleneckProducts(items, products, branchId);
      expect(bottlenecks).toHaveLength(1);
      expect(bottlenecks[0].product.name).toBe('Scarce Product');
      expect(bottlenecks[0].availableForCombo).toBe(5);
    });

    it('returns multiple bottlenecks if tied', () => {
      const products = [
        createProduct({
          systemId: 'prod-1' as SystemId,
          inventoryByBranch: { [branchId]: 10 },
        }),
        createProduct({
          systemId: 'prod-2' as SystemId,
          inventoryByBranch: { [branchId]: 10 },
        }),
      ];
      const items = [
        createComboItem('prod-1', 1),
        createComboItem('prod-2', 1),
      ];
      
      const bottlenecks = getComboBottleneckProducts(items, products, branchId);
      expect(bottlenecks).toHaveLength(2);
    });
  });
});
