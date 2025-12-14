import { describe, expect, it } from 'vitest';
import { useOrderStore } from '@/features/orders/store';
import type {
  OrderMainStatus,
  OrderPaymentStatus,
  OrderDeliveryStatus,
  OrderPrintStatus,
  OrderStockOutStatus,
  OrderReturnStatus,
  PackagingStatus,
} from '@/features/orders/types';
import {
  ORDER_MAIN_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  DELIVERY_STATUS_MAP,
  PRINT_STATUS_MAP,
  STOCK_OUT_STATUS_MAP,
  RETURN_STATUS_MAP,
  PACKAGING_STATUS_MAP,
} from '@/components/StatusBadge';

// ---------------------------------------------------------------------------
// Type-level helpers to ensure arrays cover entire unions
// ---------------------------------------------------------------------------
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? ((<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false)
  : false;
type Expect<T extends true> = T;

const ORDER_MAIN_STATUSES = ['Đặt hàng', 'Đang giao dịch', 'Hoàn thành', 'Đã hủy'] as const satisfies ReadonlyArray<OrderMainStatus>;
type _EnsureOrderMainStatuses = Expect<Equal<OrderMainStatus, (typeof ORDER_MAIN_STATUSES)[number]>>;

const ORDER_PAYMENT_STATUSES = ['Chưa thanh toán', 'Thanh toán 1 phần', 'Thanh toán toàn bộ'] as const satisfies ReadonlyArray<OrderPaymentStatus>;
type _EnsureOrderPaymentStatuses = Expect<Equal<OrderPaymentStatus, (typeof ORDER_PAYMENT_STATUSES)[number]>>;

const ORDER_DELIVERY_STATUSES = ['Chờ đóng gói', 'Đã đóng gói', 'Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Chờ giao lại', 'Đã hủy'] as const satisfies ReadonlyArray<OrderDeliveryStatus>;
type _EnsureOrderDeliveryStatuses = Expect<Equal<OrderDeliveryStatus, (typeof ORDER_DELIVERY_STATUSES)[number]>>;

const ORDER_PRINT_STATUSES = ['Đã in', 'Chưa in'] as const satisfies ReadonlyArray<OrderPrintStatus>;
type _EnsureOrderPrintStatuses = Expect<Equal<OrderPrintStatus, (typeof ORDER_PRINT_STATUSES)[number]>>;

const ORDER_STOCK_OUT_STATUSES = ['Chưa xuất kho', 'Xuất kho toàn bộ'] as const satisfies ReadonlyArray<OrderStockOutStatus>;
type _EnsureOrderStockOutStatuses = Expect<Equal<OrderStockOutStatus, (typeof ORDER_STOCK_OUT_STATUSES)[number]>>;

const ORDER_RETURN_STATUSES = ['Chưa trả hàng', 'Trả hàng một phần', 'Trả hàng toàn bộ'] as const satisfies ReadonlyArray<OrderReturnStatus>;
type _EnsureOrderReturnStatuses = Expect<Equal<OrderReturnStatus, (typeof ORDER_RETURN_STATUSES)[number]>>;

const PACKAGING_STATUSES = ['Chờ đóng gói', 'Đã đóng gói', 'Hủy đóng gói'] as const satisfies ReadonlyArray<PackagingStatus>;
type _EnsurePackagingStatuses = Expect<Equal<PackagingStatus, (typeof PACKAGING_STATUSES)[number]>>;

const ORDER_REQUIRED_METHODS = [
  'cancelOrder',
  'addPayment',
  'requestPackaging',
  'confirmPackaging',
  'cancelPackagingRequest',
  'processInStorePickup',
  'confirmInStorePickup',
  'confirmPartnerShipment',
  'dispatchFromWarehouse',
  'completeDelivery',
  'failDelivery',
  'cancelDeliveryOnly',
  'cancelDelivery',
  'confirmCodReconciliation',
  'processGHTKWebhook',
] as const;

describe('orders domain guard tests', () => {
  it('exposes the orchestration helpers on useOrderStore', () => {
    const state = useOrderStore.getState() as unknown as Record<string, unknown>;

    ORDER_REQUIRED_METHODS.forEach((method) => {
      expect(typeof state[method]).toBe('function');
    });
  });

  it('keeps all order status maps aligned with their type unions', () => {
    ORDER_MAIN_STATUSES.forEach((status) => expect(ORDER_MAIN_STATUS_MAP[status]).toBeDefined());
    ORDER_PAYMENT_STATUSES.forEach((status) => expect(PAYMENT_STATUS_MAP[status]).toBeDefined());
    ORDER_DELIVERY_STATUSES.forEach((status) => expect(DELIVERY_STATUS_MAP[status]).toBeDefined());
    ORDER_PRINT_STATUSES.forEach((status) => expect(PRINT_STATUS_MAP[status]).toBeDefined());
    ORDER_STOCK_OUT_STATUSES.forEach((status) => expect(STOCK_OUT_STATUS_MAP[status]).toBeDefined());
    ORDER_RETURN_STATUSES.forEach((status) => expect(RETURN_STATUS_MAP[status]).toBeDefined());
    PACKAGING_STATUSES.forEach((status) => expect(PACKAGING_STATUS_MAP[status]).toBeDefined());
  });
});
