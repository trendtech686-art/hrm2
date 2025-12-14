/**
 * @file Supplier Store Tests
 * @description Tests for supplier management based on testing-checklist.md Section 11
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSupplierStore } from '../store';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

// Mock auth context
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => 'EMP001',
}));

describe('Supplier Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 11. Nhà cung cấp
  describe('11. Nhà cung cấp (Suppliers)', () => {
    it('returns list of suppliers', () => {
      const store = useSupplierStore.getState();
      expect(store.data).toBeDefined();
      expect(Array.isArray(store.data)).toBe(true);
    });

    it('filters active suppliers correctly', () => {
      const store = useSupplierStore.getState();
      const activeSuppliers = store.getActive();
      
      expect(Array.isArray(activeSuppliers)).toBe(true);
      activeSuppliers.forEach(supplier => {
        expect(supplier.isDeleted).not.toBe(true);
      });
    });

    it('searches suppliers by query', async () => {
      const store = useSupplierStore.getState();
      const result = await store.searchSuppliers('', 1, 10);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('hasNextPage');
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('paginates search results correctly', async () => {
      const store = useSupplierStore.getState();
      const page1 = await store.searchSuppliers('', 1, 5);
      
      expect(page1.items).toBeDefined();
      expect(typeof page1.hasNextPage).toBe('boolean');
    });

    it('adds a new supplier', () => {
      const initialCount = useSupplierStore.getState().data.length;
      
      const newSupplier = {
        id: asBusinessId('NCC-TEST-001'),
        name: 'Test Supplier',
        phone: '0901234567',
        email: 'supplier@test.com',
        address: '123 Test Street',
        status: 'active' as const,
      };
      
      const result = useSupplierStore.getState().add(newSupplier as any);
      
      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Supplier');
      expect(useSupplierStore.getState().data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new supplier', () => {
      const store = useSupplierStore.getState();
      
      const newSupplier = {
        id: asBusinessId('NCC-TEST-002'),
        name: 'Test Supplier 2',
        phone: '0901234568',
        status: 'active' as const,
      };
      
      const result = store.add(newSupplier as any);
      
      expect(result?.systemId).toBeDefined();
      expect(typeof result?.systemId).toBe('string');
    });

    it('finds supplier by systemId', () => {
      const store = useSupplierStore.getState();
      const suppliers = store.data;
      
      if (suppliers.length > 0) {
        const firstSupplier = suppliers[0];
        const found = store.findById(firstSupplier.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstSupplier.systemId);
      }
    });

    it('updates supplier information', () => {
      const store = useSupplierStore.getState();
      const suppliers = store.data;
      
      if (suppliers.length > 0) {
        const supplier = suppliers[0];
        const newName = 'Updated Supplier Name';
        
        store.update(supplier.systemId, { ...supplier, name: newName });
        
        const updated = store.findById(supplier.systemId);
        expect(updated?.name).toBe(newName);
      }
    });

    it('soft deletes a supplier', () => {
      const store = useSupplierStore.getState();
      const suppliers = store.data;
      
      if (suppliers.length > 0) {
        const supplier = suppliers[0];
        store.remove(supplier.systemId);
        
        const removed = store.findById(supplier.systemId);
        expect(removed?.isDeleted).toBe(true);
      }
    });

    it('updates status for multiple suppliers', () => {
      const store = useSupplierStore.getState();
      const activeSuppliers = store.getActive().slice(0, 2);
      
      if (activeSuppliers.length >= 2) {
        const systemIds = activeSuppliers.map(s => s.systemId);
        store.updateStatus(systemIds, 'Ngừng Giao Dịch');
        
        systemIds.forEach(id => {
          const supplier = store.findById(id);
          expect(supplier?.status).toBe('Ngừng Giao Dịch');
        });
      }
    });

    it('bulk deletes suppliers', () => {
      const store = useSupplierStore.getState();
      const activeSuppliers = store.getActive().slice(0, 2);
      
      if (activeSuppliers.length >= 2) {
        const systemIds = activeSuppliers.map(s => s.systemId);
        store.bulkDelete(systemIds);
        
        systemIds.forEach(id => {
          const supplier = store.findById(id);
          expect(supplier?.isDeleted).toBe(true);
        });
      }
    });

    it('restores deleted supplier', () => {
      const store = useSupplierStore.getState();
      const deletedSuppliers = store.data.filter(s => s.isDeleted);
      
      if (deletedSuppliers.length > 0) {
        const supplier = deletedSuppliers[0];
        store.restore(supplier.systemId);
        
        const restored = store.findById(supplier.systemId);
        expect(restored?.isDeleted).toBe(false);
      }
    });
  });
});
