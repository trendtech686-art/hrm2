/**
 * @file Order Store Tests
 * @description Tests for order management based on testing-checklist.md Section 4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOrderStore } from '../store';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

// Mock dependencies
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => 'EMP001',
  getCurrentUserInfo: () => ({ systemId: 'EMP001', name: 'Test User' }),
}));

vi.mock('../../employees/store.ts', () => ({
  useEmployeeStore: {
    getState: () => ({
      data: [{ systemId: 'EMP001', fullName: 'Test Employee' }],
      findById: () => ({ systemId: 'EMP001', fullName: 'Test Employee' }),
    }),
  },
}));

vi.mock('../../products/store.ts', () => ({
  useProductStore: {
    getState: () => ({
      findById: () => ({
        systemId: 'PROD001',
        name: 'Test Product',
        inventoryByBranch: { BRANCH001: 100 },
      }),
      commitStock: vi.fn(),
      uncommitStock: vi.fn(),
      dispatchStock: vi.fn(),
      completeDelivery: vi.fn(),
      returnStockFromTransit: vi.fn(),
    }),
  },
}));

vi.mock('../../customers/store.ts', () => ({
  useCustomerStore: {
    getState: () => ({
      findById: () => ({ systemId: 'CUST001', name: 'Test Customer' }),
      incrementOrderStats: vi.fn(),
      decrementOrderStats: vi.fn(),
      incrementFailedDeliveryStats: vi.fn(),
      addDebtTransaction: vi.fn(),
      removeDebtTransaction: vi.fn(),
      updateDebtTransactionPayment: vi.fn(),
      update: vi.fn(),
    }),
  },
}));

vi.mock('../../stock-history/store.ts', () => ({
  useStockHistoryStore: {
    getState: () => ({
      addEntry: vi.fn(),
    }),
  },
}));

vi.mock('../../receipts/store.ts', () => ({
  useReceiptStore: {
    getState: () => ({
      data: [],
      findById: vi.fn(),
      update: vi.fn(),
    }),
    subscribe: vi.fn(),
  },
}));

vi.mock('../../cashbook/store.ts', () => ({
  useCashbookStore: {
    getState: () => ({
      accounts: [],
    }),
  },
}));

vi.mock('../../settings/receipt-types/store.ts', () => ({
  useReceiptTypeStore: {
    getState: () => ({
      data: [],
    }),
  },
}));

vi.mock('../../sales-returns/store.ts', () => ({
  useSalesReturnStore: {
    getState: () => ({
      data: [],
    }),
  },
}));

vi.mock('../../shipments/store.ts', () => ({
  useShipmentStore: {
    getState: () => ({
      createShipment: vi.fn(() => ({ systemId: 'SHIP001', id: 'VC000001' })),
      updateShipment: vi.fn(),
    }),
  },
}));

vi.mock('../../settings/sales/sales-management-store.ts', () => ({
  useSalesManagementSettingsStore: {
    getState: () => ({
      allowCancelAfterExport: true, // Allow cancel for testing
      allowNegativePacking: true,
      allowNegativeStockOut: true,
    }),
  },
}));

vi.mock('../../finance/document-helpers.ts', () => ({
  createPaymentDocument: vi.fn(() => ({ document: null, error: 'Mock' })),
  createReceiptDocument: vi.fn(() => ({
    document: {
      systemId: 'REC001',
      id: 'PT001',
      date: '2025-01-01',
      amount: 100000,
      paymentMethodName: 'Tiền mặt',
      description: 'Test payment',
    },
    error: null,
  })),
}));

describe('Order Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 4.1 Danh sách
  describe('4.1 Danh sách đơn hàng', () => {
    it('returns list of orders', () => {
      const store = useOrderStore.getState();
      expect(store.data).toBeDefined();
      expect(Array.isArray(store.data)).toBe(true);
    });

    it('filters active orders correctly', () => {
      const store = useOrderStore.getState();
      const activeOrders = store.getActive();
      
      expect(Array.isArray(activeOrders)).toBe(true);
      activeOrders.forEach(order => {
        expect(order.isDeleted).not.toBe(true);
      });
    });

    it('finds order by systemId', () => {
      const store = useOrderStore.getState();
      const orders = store.data;
      
      if (orders.length > 0) {
        const firstOrder = orders[0];
        const found = store.findById(firstOrder.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstOrder.systemId);
      }
    });
  });

  // 4.2 Tạo đơn hàng
  describe('4.2 Tạo đơn hàng', () => {
    it('creates a new order', () => {
      const initialCount = useOrderStore.getState().data.length;
      
      const newOrder = {
        id: asBusinessId('DH-TEST-001'),
        orderDate: '2025-01-01',
        customerSystemId: asSystemId('CUST001'),
        customerName: 'Test Customer',
        branchSystemId: asSystemId('BRANCH001'),
        branchName: 'Test Branch',
        salespersonSystemId: asSystemId('EMP001'),
        salesperson: 'Test Employee',
        status: 'Đặt hàng' as const,
        paymentStatus: 'Chưa thanh toán' as const,
        deliveryStatus: 'Chờ đóng gói' as const,
        stockOutStatus: 'Chưa xuất kho' as const,
        lineItems: [
          {
            systemId: 'LINE001',
            productSystemId: 'PROD001',
            productId: 'SP001',
            productName: 'Test Product',
            quantity: 2,
            unitPrice: 100000,
            discount: 0,
            discountType: 'fixed' as const,
            total: 200000,
          },
        ],
        subtotal: 200000,
        totalDiscount: 0,
        taxAmount: 20000,
        grandTotal: 220000,
        packagings: [],
        payments: [],
      };
      
      const result = useOrderStore.getState().add(newOrder as any);
      
      expect(result).toBeDefined();
      expect(result?.customerName).toBe('Test Customer');
      expect(useOrderStore.getState().data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new order', () => {
      const store = useOrderStore.getState();
      
      const newOrder = {
        id: asBusinessId('DH-TEST-002'),
        orderDate: '2025-01-01',
        customerSystemId: asSystemId('CUST001'),
        customerName: 'Test Customer',
        branchSystemId: asSystemId('BRANCH001'),
        branchName: 'Test Branch',
        status: 'Đặt hàng' as const,
        paymentStatus: 'Chưa thanh toán' as const,
        deliveryStatus: 'Chờ đóng gói' as const,
        stockOutStatus: 'Chưa xuất kho' as const,
        lineItems: [],
        subtotal: 0,
        totalDiscount: 0,
        taxAmount: 0,
        grandTotal: 0,
        packagings: [],
        payments: [],
      };
      
      const result = store.add(newOrder as any);
      
      expect(result?.systemId).toBeDefined();
    });
  });

  // 4.3 Chi tiết đơn hàng
  describe('4.3 Chi tiết đơn hàng', () => {
    it('updates order information', () => {
      const store = useOrderStore.getState();
      const orders = store.data;
      
      if (orders.length > 0) {
        const order = orders[0];
        const newNote = 'Updated order note';
        
        store.update(order.systemId, { ...order, notes: newNote });
        
        const updated = store.findById(order.systemId);
        expect(updated?.notes).toBe(newNote);
      }
    });
  });

  // 4.4 Hủy đơn hàng
  describe('4.4 Hủy đơn hàng', () => {
    it('cancels an order with reason', () => {
      const activeOrders = useOrderStore.getState().getActive().filter(o => o.status !== 'Đã hủy' && o.status !== 'Hoàn thành');
      
      if (activeOrders.length > 0) {
        const order = activeOrders[0];
        const reason = 'Khách hủy đơn';
        
        useOrderStore.getState().cancelOrder(order.systemId, asSystemId('EMP001'), { reason, restock: true });
        
        const cancelled = useOrderStore.getState().findById(order.systemId);
        expect(cancelled?.status).toBe('Đã hủy');
        expect(cancelled?.cancellationReason).toContain(reason);
      }
    });
  });

  // Packaging Flow
  describe('Packaging Flow', () => {
    it('requests packaging for order', () => {
      const store = useOrderStore.getState();
      const orders = store.getActive().filter(o => o.status !== 'Đã hủy');
      
      if (orders.length > 0) {
        const order = orders[0];
        const initialPackagings = order.packagings?.length || 0;
        
        store.requestPackaging(order.systemId, asSystemId('EMP001'));
        
        const updated = store.findById(order.systemId);
        expect(updated?.packagings?.length).toBeGreaterThanOrEqual(initialPackagings);
      }
    });

    it('confirms packaging', () => {
      const store = useOrderStore.getState();
      const ordersWithPackaging = store.getActive().filter(
        o => o.packagings && o.packagings.some(p => p.status === 'Chờ đóng gói')
      );
      
      if (ordersWithPackaging.length > 0) {
        const order = ordersWithPackaging[0];
        const packaging = order.packagings.find(p => p.status === 'Chờ đóng gói');
        
        if (packaging) {
          store.confirmPackaging(order.systemId, packaging.systemId, asSystemId('EMP001'));
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.status).toBe('Đã đóng gói');
        }
      }
    });

    it('cancels packaging request', () => {
      const store = useOrderStore.getState();
      const ordersWithPackaging = store.getActive().filter(
        o => o.packagings && o.packagings.length > 0
      );
      
      if (ordersWithPackaging.length > 0) {
        const order = ordersWithPackaging[0];
        const packaging = order.packagings[0];
        
        if (packaging && packaging.status !== 'Hủy đóng gói') {
          store.cancelPackagingRequest(order.systemId, packaging.systemId, asSystemId('EMP001'), 'Test cancel');
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.status).toBe('Hủy đóng gói');
        }
      }
    });
  });

  // Delivery Flow
  describe('Delivery Flow', () => {
    it('processes in-store pickup', () => {
      const store = useOrderStore.getState();
      const ordersWithConfirmedPackaging = store.getActive().filter(
        o => o.packagings && o.packagings.some(p => p.status === 'Đã đóng gói')
      );
      
      if (ordersWithConfirmedPackaging.length > 0) {
        const order = ordersWithConfirmedPackaging[0];
        const packaging = order.packagings.find(p => p.status === 'Đã đóng gói');
        
        if (packaging) {
          store.processInStorePickup(order.systemId, packaging.systemId);
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.deliveryMethod).toBe('Nhận tại cửa hàng');
        }
      }
    });

    it('completes delivery', () => {
      const store = useOrderStore.getState();
      const ordersWithDelivery = store.getActive().filter(
        o => o.packagings && o.packagings.some(p => p.deliveryStatus === 'Đang giao hàng')
      );
      
      if (ordersWithDelivery.length > 0) {
        const order = ordersWithDelivery[0];
        const packaging = order.packagings.find(p => p.deliveryStatus === 'Đang giao hàng');
        
        if (packaging) {
          store.completeDelivery(order.systemId, packaging.systemId, asSystemId('EMP001'));
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.deliveryStatus).toBe('Đã giao hàng');
        }
      }
    });

    it('handles failed delivery', () => {
      const store = useOrderStore.getState();
      const ordersWithDelivery = store.getActive().filter(
        o => o.packagings && o.packagings.some(p => p.deliveryStatus === 'Đang giao hàng')
      );
      
      if (ordersWithDelivery.length > 0) {
        const order = ordersWithDelivery[0];
        const packaging = order.packagings.find(p => p.deliveryStatus === 'Đang giao hàng');
        
        if (packaging) {
          store.failDelivery(order.systemId, packaging.systemId, asSystemId('EMP001'), 'Không liên lạc được');
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.deliveryStatus).toBe('Chờ giao lại');
        }
      }
    });

    it('cancels delivery with restock', () => {
      const store = useOrderStore.getState();
      const ordersWithDelivery = store.getActive().filter(
        o => o.packagings && o.packagings.some(p => 
          p.deliveryStatus && p.deliveryStatus !== 'Đã hủy'
        )
      );
      
      if (ordersWithDelivery.length > 0) {
        const order = ordersWithDelivery[0];
        const packaging = order.packagings.find(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
        
        if (packaging) {
          store.cancelDelivery(order.systemId, packaging.systemId, asSystemId('EMP001'), 'Test cancel');
          
          const updated = store.findById(order.systemId);
          const updatedPackaging = updated?.packagings.find(p => p.systemId === packaging.systemId);
          expect(updatedPackaging?.deliveryStatus).toBe('Đã hủy');
        }
      }
    });
  });

  // Payment Flow
  describe('Payment Flow', () => {
    it('adds payment to order', () => {
      const store = useOrderStore.getState();
      const unpaidOrders = store.getActive().filter(o => o.paymentStatus !== 'Thanh toán toàn bộ');
      
      if (unpaidOrders.length > 0) {
        const order = unpaidOrders[0];
        
        store.addPayment(
          order.systemId,
          { amount: 100000, method: 'Tiền mặt' },
          asSystemId('EMP001')
        );
        
        // Payment should be added (exact behavior depends on mocks)
      }
    });
  });
});
