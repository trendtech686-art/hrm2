import { describe, expect, it } from 'vitest';
import { asBusinessId, asSystemId, type SystemId } from '@/lib/id-types';
import type { Order, Packaging } from '@/features/orders/types';
import { useOrderStore } from '@/features/orders/store';
import { useProductStore } from '@/features/products/store';

const TEST_EMPLOYEE_ID = asSystemId('NV00000001');

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const snapshotProductLevels = (productSystemId: SystemId, branchSystemId: SystemId) => {
  const product = useProductStore.getState().data.find(p => p.systemId === productSystemId);
  if (!product) {
    throw new Error('Product not found in snapshot');
  }

  return {
    inventory: product.inventoryByBranch?.[branchSystemId] ?? 0,
    committed: product.committedByBranch?.[branchSystemId] ?? 0,
    inTransit: product.inTransitByBranch?.[branchSystemId] ?? 0,
  };
};

const ensureSufficientStock = (productSystemId: SystemId, branchSystemId: SystemId, requiredQty: number) => {
  const productStore = useProductStore.getState();
  const product = productStore.data.find(p => p.systemId === productSystemId);
  if (!product) {
    throw new Error('Product not found when ensuring inventory');
  }

  const currentInventory = product.inventoryByBranch?.[branchSystemId] ?? 0;
  if (currentInventory < requiredQty + 5) {
    const delta = requiredQty + 5 - currentInventory;
    productStore.updateInventory(productSystemId, branchSystemId, delta);
  }

  const committed = product.committedByBranch?.[branchSystemId] ?? 0;
  if (committed > 0) {
    productStore.uncommitStock(productSystemId, branchSystemId, committed);
  }

  const inTransit = product.inTransitByBranch?.[branchSystemId] ?? 0;
  if (inTransit > 0) {
    productStore.returnStockFromTransit(productSystemId, branchSystemId, inTransit);
  }
};

describe('orders → cancel flow', () => {
  it('returns inventory from transit when cancelling a dispatched order', () => {
    const orderState = useOrderStore.getState();
    const productState = useProductStore.getState();
    const baseOrder = clone(orderState.data[0]);

    const branchSystemId = baseOrder.branchSystemId;
    const targetProduct = productState.data.find(p => (p.inventoryByBranch?.[branchSystemId] ?? 0) >= 1) ?? productState.data[0];
    const quantity = 3;

    ensureSufficientStock(targetProduct.systemId, branchSystemId, quantity);
    const baseline = snapshotProductLevels(targetProduct.systemId, branchSystemId);

    const { systemId: _ignored, packagings: _basePackagings, lineItems: _baseLineItems, payments: _basePayments, ...orderTemplate } = baseOrder;
    const now = new Date().toISOString();
    const packagingSystemId = asSystemId(`PKG_TEST_${Date.now()}`);
    const packagingBusinessId = asBusinessId(`FUNTEST${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);

    const newPackaging: Packaging = {
      systemId: packagingSystemId,
      id: packagingBusinessId,
      requestDate: now,
      requestingEmployeeId: TEST_EMPLOYEE_ID,
      requestingEmployeeName: 'Test Employee',
      status: 'Chờ đóng gói',
      printStatus: 'Chưa in',
    };

    const orderInput: Omit<Order, 'systemId'> = {
      ...orderTemplate,
      id: '',
      lineItems: [
        {
          productSystemId: targetProduct.systemId,
          productId: targetProduct.id,
          productName: targetProduct.name,
          quantity,
          unitPrice: 100000,
          discount: 0,
          discountType: 'fixed',
        },
      ],
      packagings: [newPackaging],
      payments: [],
      paidAmount: 0,
      status: 'Đang giao dịch',
      deliveryStatus: 'Chờ đóng gói',
      stockOutStatus: 'Chưa xuất kho',
      paymentStatus: 'Chưa thanh toán',
      subtotal: 100000 * quantity,
      grandTotal: 100000 * quantity,
      codAmount: 0,
    };

    const createdOrder = orderState.add(orderInput);
    const { dispatchFromWarehouse, cancelOrder } = useOrderStore.getState();

    dispatchFromWarehouse(createdOrder.systemId, packagingSystemId, TEST_EMPLOYEE_ID);
    cancelOrder(createdOrder.systemId, TEST_EMPLOYEE_ID, {
      reason: 'Test hủy đơn khi hoàn kho',
      restock: true,
      sendEmail: false,
    });

    const finalLevels = snapshotProductLevels(targetProduct.systemId, branchSystemId);

    expect(finalLevels).toEqual(baseline);
    const cancelledOrder = useOrderStore.getState().data.find(o => o.systemId === createdOrder.systemId);
    expect(cancelledOrder?.status).toBe('Đã hủy');
    expect(cancelledOrder?.deliveryStatus).toBe('Đã hủy');
    expect(cancelledOrder?.packagings.every(pkg => pkg.status === 'Hủy đóng gói')).toBe(true);
  });
});
