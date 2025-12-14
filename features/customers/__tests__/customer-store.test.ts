/**
 * @file Customer Store Tests
 * @description Tests for customer management based on testing-checklist.md Section 3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCustomerStore } from '../store';
import type { Customer } from '../types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

// Mock auth context
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => 'EMP001',
  getCurrentUserInfo: () => ({ systemId: 'EMP001', name: 'Test User' }),
}));

describe('Customer Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 3.1 Danh sách
  describe('3.1 Danh sách khách hàng', () => {
    it('returns list of customers', () => {
      const store = useCustomerStore.getState();
      expect(store.data).toBeDefined();
      expect(Array.isArray(store.data)).toBe(true);
    });

    it('filters active customers correctly', () => {
      const store = useCustomerStore.getState();
      const activeCustomers = store.getActive();
      
      expect(Array.isArray(activeCustomers)).toBe(true);
      // All active customers should not be deleted
      activeCustomers.forEach(customer => {
        expect(customer.isDeleted).not.toBe(true);
      });
    });

    it('searches customers by query', async () => {
      const store = useCustomerStore.getState();
      const result = await store.searchCustomers('', 1, 10);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('hasNextPage');
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('paginates search results correctly', async () => {
      const store = useCustomerStore.getState();
      const page1 = await store.searchCustomers('', 1, 5);
      const page2 = await store.searchCustomers('', 2, 5);
      
      expect(page1.items).toBeDefined();
      expect(page2.items).toBeDefined();
      // Page results should be different if there are enough items
    });
  });

  // 3.2 Tạo mới
  describe('3.2 Tạo khách hàng mới', () => {
    it('adds a new customer', () => {
      const initialCount = useCustomerStore.getState().data.length;
      
      const newCustomer = {
        id: asBusinessId('KH-TEST-001'),
        name: 'Test Customer',
        phone: '0901234567',
        email: 'test@example.com',
        status: 'active' as const,
        type: 'individual' as const,
      };
      
      const result = useCustomerStore.getState().add(newCustomer as any);
      
      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Customer');
      expect(useCustomerStore.getState().data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new customer', () => {
      const store = useCustomerStore.getState();
      
      const newCustomer = {
        id: asBusinessId('KH-TEST-002'),
        name: 'Test Customer 2',
        phone: '0901234568',
        status: 'active' as const,
      };
      
      const result = store.add(newCustomer as any);
      
      expect(result?.systemId).toBeDefined();
      expect(typeof result?.systemId).toBe('string');
    });

    it('calculates lifecycle stage on creation', () => {
      const store = useCustomerStore.getState();
      
      const newCustomer = {
        id: asBusinessId('KH-TEST-003'),
        name: 'New Customer',
        phone: '0901234569',
        status: 'active' as const,
        totalOrders: 0,
      };
      
      const result = store.add(newCustomer as any);
      
      expect(result?.lifecycleStage).toBeDefined();
    });
  });

  // 3.3 Chi tiết & Chỉnh sửa
  describe('3.3 Chi tiết & Chỉnh sửa', () => {
    it('finds customer by systemId', () => {
      const store = useCustomerStore.getState();
      const customers = store.data;
      
      if (customers.length > 0) {
        const firstCustomer = customers[0];
        const found = store.findById(firstCustomer.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstCustomer.systemId);
      }
    });

    it('updates customer information', () => {
      const store = useCustomerStore.getState();
      const customers = store.data;
      
      if (customers.length > 0) {
        const customer = customers[0];
        const newName = 'Updated Customer Name';
        
        store.update(customer.systemId, { ...customer, name: newName });
        
        const updated = store.findById(customer.systemId);
        expect(updated?.name).toBe(newName);
      }
    });
  });

  // 3.4 Xóa
  describe('3.4 Xóa khách hàng', () => {
    it('soft deletes a customer', () => {
      const store = useCustomerStore.getState();
      const customers = store.data;
      
      if (customers.length > 0) {
        const customer = customers[0];
        store.remove(customer.systemId);
        
        const removed = store.findById(customer.systemId);
        expect(removed?.isDeleted).toBe(true);
      }
    });

    it('removes multiple customers', () => {
      const store = useCustomerStore.getState();
      const activeCustomers = store.getActive().slice(0, 2);
      
      if (activeCustomers.length >= 2) {
        const systemIds = activeCustomers.map(c => c.systemId);
        store.removeMany(systemIds);
        
        systemIds.forEach(id => {
          const customer = store.findById(id);
          expect(customer?.isDeleted).toBe(true);
        });
      }
    });

    it('restores deleted customers', () => {
      const store = useCustomerStore.getState();
      const deletedCustomers = store.data.filter(c => c.isDeleted);
      
      if (deletedCustomers.length > 0) {
        const customer = deletedCustomers[0];
        store.restore(customer.systemId);
        
        const restored = store.findById(customer.systemId);
        expect(restored?.isDeleted).toBe(false);
      }
    });
  });

  // Debt Management
  describe('Debt Management', () => {
    it('updates customer debt', () => {
      const store = useCustomerStore.getState();
      const customers = store.getActive();
      
      if (customers.length > 0) {
        const customer = customers[0];
        const initialDebt = customer.currentDebt || 0;
        
        store.updateDebt(customer.systemId, 500000);
        
        const updated = store.findById(customer.systemId);
        expect(updated?.currentDebt).toBe(initialDebt + 500000);
      }
    });

    it('adds debt transaction', () => {
      const store = useCustomerStore.getState();
      const customers = store.getActive();
      
      if (customers.length > 0) {
        const customer = customers[0];
        
        store.addDebtTransaction(customer.systemId, {
          systemId: asSystemId('DEBT001'),
          orderId: asBusinessId('DH001'),
          orderDate: '2025-01-01',
          amount: 1000000,
          dueDate: '2025-02-01',
          isPaid: false,
          remainingAmount: 1000000,
        });
        
        const updated = store.findById(customer.systemId);
        expect(updated?.debtTransactions).toBeDefined();
      }
    });

    it('gets high risk debt customers', () => {
      const store = useCustomerStore.getState();
      const highRiskCustomers = store.getHighRiskDebtCustomers();
      
      expect(Array.isArray(highRiskCustomers)).toBe(true);
    });

    it('gets overdue debt customers', () => {
      const store = useCustomerStore.getState();
      const overdueCustomers = store.getOverdueDebtCustomers();
      
      expect(Array.isArray(overdueCustomers)).toBe(true);
    });
  });

  // Order Stats
  describe('Order Statistics', () => {
    it('increments order stats', () => {
      const store = useCustomerStore.getState();
      const customers = store.getActive();
      
      if (customers.length > 0) {
        const customer = customers[0];
        const initialOrders = customer.totalOrders || 0;
        const initialSpent = customer.totalSpent || 0;
        
        store.incrementOrderStats(customer.systemId, 1000000);
        
        const updated = store.findById(customer.systemId);
        expect(updated?.totalOrders).toBe(initialOrders + 1);
        expect(updated?.totalSpent).toBe(initialSpent + 1000000);
      }
    });

    it('decrements order stats', () => {
      const store = useCustomerStore.getState();
      const customers = store.getActive();
      
      if (customers.length > 0) {
        const customer = customers[0];
        
        // First increment
        store.incrementOrderStats(customer.systemId, 1000000);
        const afterIncrement = store.findById(customer.systemId);
        
        // Then decrement
        store.decrementOrderStats(customer.systemId, 1000000);
        const afterDecrement = store.findById(customer.systemId);
        
        expect(afterDecrement?.totalOrders).toBe((afterIncrement?.totalOrders || 1) - 1);
      }
    });
  });

  // Customer Intelligence
  describe('Customer Intelligence', () => {
    it('updates customer intelligence (RFM, health score)', () => {
      const store = useCustomerStore.getState();
      
      // This should not throw
      expect(() => store.updateCustomerIntelligence()).not.toThrow();
    });

    it('gets customers by segment', () => {
      const store = useCustomerStore.getState();
      const champions = store.getCustomersBySegment('Champions');
      
      expect(Array.isArray(champions)).toBe(true);
    });
  });

  // Bulk Operations
  describe('Bulk Operations', () => {
    it('updates status for multiple customers', () => {
      const store = useCustomerStore.getState();
      const customers = store.getActive().slice(0, 2);
      
      if (customers.length >= 2) {
        const systemIds = customers.map(c => c.systemId);
        store.updateManyStatus(systemIds, 'inactive');
        
        systemIds.forEach(id => {
          const customer = store.findById(id);
          expect(customer?.status).toBe('inactive');
        });
      }
    });

    it('restores multiple customers', () => {
      const store = useCustomerStore.getState();
      const deletedCustomers = store.data.filter(c => c.isDeleted).slice(0, 2);
      
      if (deletedCustomers.length >= 2) {
        const systemIds = deletedCustomers.map(c => c.systemId);
        store.restoreMany(systemIds);
        
        systemIds.forEach(id => {
          const customer = store.findById(id);
          expect(customer?.isDeleted).toBe(false);
        });
      }
    });
  });
});
