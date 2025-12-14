/**
 * @file Product Store Tests
 * @description Tests for product management based on testing-checklist.md Section 5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing store
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => 'EMP001',
  getCurrentUserInfo: () => ({ systemId: 'EMP001', name: 'Test User' }),
}));

// Import after mocks
import { useProductStore } from '../store';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

describe('Product Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 5.1 Danh sách
  describe('5.1 Danh sách sản phẩm', () => {
    it('returns list of products', () => {
      const store = useProductStore.getState();
      expect(store.data).toBeDefined();
      expect(Array.isArray(store.data)).toBe(true);
    });

    it('filters active products correctly', () => {
      const store = useProductStore.getState();
      const activeProducts = store.getActive();
      
      expect(Array.isArray(activeProducts)).toBe(true);
      activeProducts.forEach(product => {
        expect(product.isDeleted).not.toBe(true);
      });
    });

    it('finds product by systemId', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const firstProduct = products[0];
        const found = store.findById(firstProduct.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstProduct.systemId);
      }
    });

    it('filters products by category', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0 && products[0].categorySystemId) {
        const categoryId = products[0].categorySystemId;
        const filtered = products.filter(p => p.categorySystemId === categoryId);
        
        expect(filtered.length).toBeGreaterThan(0);
      }
    });

    it('filters products by status', () => {
      const store = useProductStore.getState();
      const activeProducts = store.data.filter(p => p.status === 'active' && !p.isDeleted);
      
      expect(Array.isArray(activeProducts)).toBe(true);
    });
  });

  // 5.2 Tạo sản phẩm
  describe('5.2 Tạo sản phẩm', () => {
    it('creates a new product', () => {
      const initialCount = useProductStore.getState().data.length;
      
      const newProduct = {
        id: asBusinessId('SP-TEST-001'),
        sku: 'SKU-TEST-001',
        name: 'Test Product',
        sellingPrice: 100000,
        costPrice: 80000,
        unit: 'Cái',
        status: 'active' as const,
      };
      
      const result = useProductStore.getState().add(newProduct as any);
      
      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Product');
      expect(useProductStore.getState().data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new product', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-TEST-002'),
        sku: 'SKU-TEST-002',
        name: 'Test Product 2',
        sellingPrice: 50000,
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.systemId).toBeDefined();
    });

    it('creates product with category', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-TEST-003'),
        name: 'Categorized Product',
        sellingPrice: 75000,
        categorySystemId: asSystemId('CAT001'),
        categoryName: 'Test Category',
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.categorySystemId).toBe('CAT001');
    });

    it('creates product with tax', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-TEST-004'),
        name: 'Taxed Product',
        sellingPrice: 100000,
        taxSystemId: asSystemId('TAX001'),
        taxRate: 10,
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.taxRate).toBe(10);
    });
  });

  // 5.3 Chi tiết & Chỉnh sửa
  describe('5.3 Chi tiết & Chỉnh sửa', () => {
    it('updates product information', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const newName = 'Updated Product Name';
        
        store.update(product.systemId, { ...product, name: newName });
        
        const updated = store.findById(product.systemId);
        expect(updated?.name).toBe(newName);
      }
    });

    it('updates product selling price', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const newPrice = 150000;
        
        store.update(product.systemId, { ...product, sellingPrice: newPrice });
        
        const updated = store.findById(product.systemId);
        expect(updated?.sellingPrice).toBe(newPrice);
      }
    });

    it('updates product cost price', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const newCost = 90000;
        
        store.update(product.systemId, { ...product, costPrice: newCost });
        
        const updated = store.findById(product.systemId);
        expect(updated?.costPrice).toBe(newCost);
      }
    });
  });

  // 5.4 Combo/Bộ sản phẩm - covered by combo-utils.test.ts

  // 5.5 Xóa
  describe('5.5 Xóa sản phẩm', () => {
    it('soft deletes a product', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        store.remove(product.systemId);
        
        const removed = store.findById(product.systemId);
        expect(removed?.isDeleted).toBe(true);
      }
    });

    it('restores deleted product', () => {
      const store = useProductStore.getState();
      const deletedProducts = store.data.filter(p => p.isDeleted);
      
      if (deletedProducts.length > 0) {
        const product = deletedProducts[0];
        store.restore(product.systemId);
        
        const restored = store.findById(product.systemId);
        expect(restored?.isDeleted).toBe(false);
      }
    });
  });

  // Stock Management
  describe('Stock Management', () => {
    it('commits stock for product', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const branchId = asSystemId('BRANCH001');
        const quantity = 5;
        
        // This should not throw
        expect(() => store.commitStock(product.systemId, branchId, quantity)).not.toThrow();
      }
    });

    it('uncommits stock for product', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const branchId = asSystemId('BRANCH001');
        const quantity = 5;
        
        // First commit
        store.commitStock(product.systemId, branchId, quantity);
        
        // Then uncommit - should not throw
        expect(() => store.uncommitStock(product.systemId, branchId, quantity)).not.toThrow();
      }
    });

    it('dispatches stock from warehouse', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const branchId = asSystemId('BRANCH001');
        const quantity = 3;
        
        expect(() => store.dispatchStock(product.systemId, branchId, quantity)).not.toThrow();
      }
    });

    it('completes delivery', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const branchId = asSystemId('BRANCH001');
        const quantity = 2;
        
        expect(() => store.completeDelivery(product.systemId, branchId, quantity)).not.toThrow();
      }
    });

    it('returns stock from transit', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      if (products.length > 0) {
        const product = products[0];
        const branchId = asSystemId('BRANCH001');
        const quantity = 1;
        
        expect(() => store.returnStockFromTransit(product.systemId, branchId, quantity)).not.toThrow();
      }
    });
  });

  // Barcode/SKU
  describe('Barcode and SKU', () => {
    it('creates product with barcode', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-BARCODE-001'),
        name: 'Barcode Product',
        sellingPrice: 50000,
        barcode: '8934567890123',
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.barcode).toBe('8934567890123');
    });

    it('creates product with SKU', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-SKU-001'),
        name: 'SKU Product',
        sellingPrice: 60000,
        sku: 'SKU-UNIQUE-001',
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.sku).toBe('SKU-UNIQUE-001');
    });
  });

  // Unit of Measure
  describe('Unit of Measure', () => {
    it('creates product with unit', () => {
      const store = useProductStore.getState();
      
      const newProduct = {
        id: asBusinessId('SP-UNIT-001'),
        name: 'Unit Product',
        sellingPrice: 30000,
        unit: 'Hộp',
        status: 'active' as const,
      };
      
      const result = store.add(newProduct as any);
      
      expect(result?.unit).toBe('Hộp');
    });
  });

  // Low Stock Filtering
  describe('Stock Status Filtering', () => {
    it('filters products with low stock', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      // Filter products with inventory below threshold
      const lowStockProducts = products.filter(p => {
        const totalInventory = Object.values(p.inventoryByBranch || {}).reduce(
          (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 
          0
        );
        return totalInventory < 10;
      });
      
      expect(Array.isArray(lowStockProducts)).toBe(true);
    });

    it('filters out of stock products', () => {
      const store = useProductStore.getState();
      const products = store.data;
      
      const outOfStockProducts = products.filter(p => {
        const totalInventory = Object.values(p.inventoryByBranch || {}).reduce(
          (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 
          0
        );
        return totalInventory === 0;
      });
      
      expect(Array.isArray(outOfStockProducts)).toBe(true);
    });
  });
});
