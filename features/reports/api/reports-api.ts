/**
 * API báo cáo — fetch từ route handler (tổng hợp server).
 */

import type {
  DeliveryBranchReportRow,
  DeliveryCarrierReportRow,
  DeliveryChannelReportRow,
  DeliveryCustomerReportRow,
  DeliveryEmployeeReportRow,
  DeliveryReportSummary,
  DeliveryShipmentReportRow,
  DeliverySourceReportRow,
  DeliveryTimeReportRow,
  InventoryBranchReportRow,
  InventoryCategoryReportRow,
  InventoryProductReportRow,
  PaymentBranchReportRow,
  PaymentMethodReportRow,
  PaymentTimeReportRow,
  ReportDateRange,
  ReturnOrderReportRow,
  ReturnProductReportRow,
  SalesReportSummary,
  SalesTimeReportRow,
  TimeGrouping,
} from '@/features/reports/business-activity/types';
import type { SystemId } from '@/lib/id-types';

/** Chiều gom cho GET /api/reports/sales-by-dimension */
export type SalesByDimension =
  | 'employee'
  | 'product'
  | 'branch'
  | 'customer'
  | 'source'
  | 'customer_group'
  | 'tax';

export interface FetchSalesByDimensionParams {
  dimension: SalesByDimension;
  dateRange: ReportDateRange;
  branchIds?: SystemId[];
  categoryIds?: SystemId[];
  customerGroupIds?: string[];
}

export interface SalesByDimensionResponse {
  data: unknown[];
  summary: SalesReportSummary;
}

const SALES_TIME_SERIES = '/api/reports/sales-time-series';

export interface FetchSalesTimeSeriesParams {
  dateRange: ReportDateRange;
  grouping: TimeGrouping;
  branchIds?: SystemId[];
  employeeIds?: SystemId[];
  sourceIds?: string[];
}

export interface SalesTimeSeriesResponse {
  data: SalesTimeReportRow[];
  summary: SalesReportSummary;
}

export async function fetchSalesTimeSeries(
  params: FetchSalesTimeSeriesParams,
): Promise<SalesTimeSeriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('startDate', params.dateRange.from);
  searchParams.set('endDate', params.dateRange.to);
  searchParams.set('grouping', params.grouping);
  if (params.branchIds?.length) {
    searchParams.set('branchIds', params.branchIds.join(','));
  }
  if (params.employeeIds?.length) {
    searchParams.set('employeeIds', params.employeeIds.join(','));
  }
  if (params.sourceIds?.length) {
    searchParams.set('sourceIds', params.sourceIds.join(','));
  }

  const res = await fetch(`${SALES_TIME_SERIES}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo bán hàng theo thời gian (${res.status}): ${text}`);
  }
  return res.json() as Promise<SalesTimeSeriesResponse>;
}

const REPORTS_OVERVIEW = '/api/reports/overview';

export interface ReportsOverviewInventoryItem {
  productSystemId: string;
  productName: string;
  productCode: string | null;
  available: number;
  stockStatus: 'out_of_stock' | 'low_stock';
}

export interface ReportsOverviewResponse {
  sales: {
    currentMonth: SalesReportSummary;
    previousMonth: SalesReportSummary;
    /** 14 ngày gần nhất (rolling), doanh thu/ngày */
    last14Days: { label: string; value: number }[];
  };
  payments: {
    currentMonth: { totalAmount: number; transactionCount: number };
  };
  inventory: {
    outOfStockCount: number;
    lowStockCount: number;
    alertItems: ReportsOverviewInventoryItem[];
  };
}

export async function fetchReportsOverview(): Promise<ReportsOverviewResponse> {
  const res = await fetch(REPORTS_OVERVIEW);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được tổng quan báo cáo (${res.status}): ${text}`);
  }
  return res.json() as Promise<ReportsOverviewResponse>;
}

const SALES_BY_DIMENSION = '/api/reports/sales-by-dimension';

export async function fetchSalesByDimension(
  params: FetchSalesByDimensionParams,
): Promise<SalesByDimensionResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('dimension', params.dimension);
  searchParams.set('startDate', params.dateRange.from);
  searchParams.set('endDate', params.dateRange.to);
  if (params.branchIds?.length) {
    searchParams.set('branchIds', params.branchIds.join(','));
  }
  if (params.categoryIds?.length) {
    searchParams.set('categoryIds', params.categoryIds.join(','));
  }
  if (params.customerGroupIds?.length) {
    searchParams.set('customerGroupIds', params.customerGroupIds.join(','));
  }

  const res = await fetch(`${SALES_BY_DIMENSION}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo bán hàng theo chiều (${res.status}): ${text}`);
  }
  return res.json() as Promise<SalesByDimensionResponse>;
}

const PAYMENTS_AGGREGATE = '/api/reports/payments-aggregate';

export interface PaymentsTimeSeriesResponse {
  data: PaymentTimeReportRow[];
  summary: { transactionCount: number; totalAmount: number; averageAmount: number };
}

export async function fetchPaymentsTimeSeries(params: {
  dateRange: ReportDateRange;
  grouping: TimeGrouping;
}): Promise<PaymentsTimeSeriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'time-series');
  searchParams.set('startDate', params.dateRange.from);
  searchParams.set('endDate', params.dateRange.to);
  searchParams.set('grouping', params.grouping);

  const res = await fetch(`${PAYMENTS_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo thanh toán theo thời gian (${res.status}): ${text}`);
  }
  return res.json() as Promise<PaymentsTimeSeriesResponse>;
}

export interface PaymentsMethodResponse {
  data: PaymentMethodReportRow[];
  summary: { transactionCount: number; totalAmount: number; averageAmount: number };
}

export async function fetchPaymentsByMethod(
  dateRange: ReportDateRange,
): Promise<PaymentsMethodResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'method');
  searchParams.set('startDate', dateRange.from);
  searchParams.set('endDate', dateRange.to);

  const res = await fetch(`${PAYMENTS_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo thanh toán theo phương thức (${res.status}): ${text}`);
  }
  return res.json() as Promise<PaymentsMethodResponse>;
}

export interface PaymentsBranchResponse {
  data: PaymentBranchReportRow[];
  summary: { transactionCount: number; totalAmount: number; averageAmount: number };
}

export async function fetchPaymentsByBranch(
  dateRange: ReportDateRange,
): Promise<PaymentsBranchResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'branch');
  searchParams.set('startDate', dateRange.from);
  searchParams.set('endDate', dateRange.to);

  const res = await fetch(`${PAYMENTS_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo thanh toán theo chi nhánh (${res.status}): ${text}`);
  }
  return res.json() as Promise<PaymentsBranchResponse>;
}

// --- Delivery / Returns / Inventory (tổng hợp server) ---

const DELIVERY_AGGREGATE = '/api/reports/delivery-aggregate';

export interface DeliveryTimeSeriesPayload {
  data: DeliveryTimeReportRow[];
  summary: Record<string, number>;
}

export type DeliveryReportView =
  | 'time-series'
  | 'employee'
  | 'carrier'
  | 'branch'
  | 'customer'
  | 'channel'
  | 'source'
  | 'shipment-list';

export interface DeliveryShipmentListResponse {
  data: DeliveryShipmentReportRow[];
  summary: DeliveryReportSummary;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

type DeliveryDimensionResponse =
  | { data: DeliveryEmployeeReportRow[] }
  | { data: DeliveryCarrierReportRow[] }
  | { data: DeliveryBranchReportRow[] }
  | { data: DeliveryCustomerReportRow[] }
  | { data: DeliveryChannelReportRow[] }
  | { data: DeliverySourceReportRow[] };

export async function fetchDeliveryReport(params: {
  view: 'time-series';
  dateRange: ReportDateRange;
  grouping?: TimeGrouping;
  branchIds?: SystemId[];
  carrierIds?: string[];
}): Promise<DeliveryTimeSeriesPayload>;

export async function fetchDeliveryReport(params: {
  view: 'shipment-list';
  dateRange: ReportDateRange;
  branchIds?: SystemId[];
  carrierIds?: string[];
  page?: number;
  limit?: number;
}): Promise<DeliveryShipmentListResponse>;

export async function fetchDeliveryReport(params: {
  view: Exclude<DeliveryReportView, 'time-series' | 'shipment-list'>;
  dateRange: ReportDateRange;
  grouping?: TimeGrouping;
  branchIds?: SystemId[];
  carrierIds?: string[];
  page?: number;
  limit?: number;
}): Promise<DeliveryDimensionResponse>;

export async function fetchDeliveryReport(params: {
  view: DeliveryReportView;
  dateRange: ReportDateRange;
  grouping?: TimeGrouping;
  branchIds?: SystemId[];
  carrierIds?: string[];
  page?: number;
  limit?: number;
}): Promise<DeliveryTimeSeriesPayload | DeliveryShipmentListResponse | DeliveryDimensionResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', params.view);
  searchParams.set('startDate', params.dateRange.from);
  searchParams.set('endDate', params.dateRange.to);
  if (params.grouping) searchParams.set('grouping', params.grouping);
  if (params.branchIds?.length) searchParams.set('branchIds', params.branchIds.join(','));
  if (params.carrierIds?.length) searchParams.set('carrierIds', params.carrierIds.join(','));
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));

  const res = await fetch(`${DELIVERY_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo giao hàng (${res.status}): ${text}`);
  }
  return res.json() as Promise<
    DeliveryTimeSeriesPayload | DeliveryShipmentListResponse | DeliveryDimensionResponse
  >;
}

export async function fetchDeliveryTimeSeries(params: {
  dateRange: ReportDateRange;
  grouping: TimeGrouping;
  branchIds?: SystemId[];
  carrierIds?: string[];
}): Promise<DeliveryTimeSeriesPayload> {
  return fetchDeliveryReport({
    view: 'time-series',
    dateRange: params.dateRange,
    grouping: params.grouping,
    branchIds: params.branchIds,
    carrierIds: params.carrierIds,
  });
}

const RETURNS_AGGREGATE = '/api/reports/returns-aggregate';

export interface ReturnsOrderListPayload {
  data: ReturnOrderReportRow[];
  summary: {
    totalReturns: number;
    totalReturnAmount: number;
    totalRefundAmount: number;
    totalItems: number;
  };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchReturnsOrderList(
  dateRange: ReportDateRange,
  page = 1,
  limit = 500,
): Promise<ReturnsOrderListPayload> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'order-list');
  searchParams.set('startDate', dateRange.from);
  searchParams.set('endDate', dateRange.to);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  const res = await fetch(`${RETURNS_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo trả hàng theo đơn (${res.status}): ${text}`);
  }
  return res.json() as Promise<ReturnsOrderListPayload>;
}

export interface ReturnsProductPayload {
  data: ReturnProductReportRow[];
  summary: {
    totalProducts: number;
    totalQuantityReturned: number;
    totalReturnAmount: number;
  };
}

export async function fetchReturnsProductAggregate(
  dateRange: ReportDateRange,
): Promise<ReturnsProductPayload> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'product');
  searchParams.set('startDate', dateRange.from);
  searchParams.set('endDate', dateRange.to);

  const res = await fetch(`${RETURNS_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo trả hàng theo sản phẩm (${res.status}): ${text}`);
  }
  return res.json() as Promise<ReturnsProductPayload>;
}

const INVENTORY_AGGREGATE = '/api/reports/inventory-aggregate';

export interface InventoryProductPayload {
  data: InventoryProductReportRow[];
  summary: {
    totalProducts: number;
    totalOnHand: number;
    totalCommitted: number;
    totalAvailable: number;
    totalInventoryValue: number;
    outOfStockCount: number;
    lowStockCount: number;
  };
}

export async function fetchInventoryProductReport(filters?: {
  branchId?: SystemId;
  categoryId?: SystemId;
  stockStatus?: string;
}): Promise<InventoryProductPayload> {
  const searchParams = new URLSearchParams();
  searchParams.set('view', 'product');
  if (filters?.branchId) searchParams.set('branchId', filters.branchId);
  if (filters?.categoryId) searchParams.set('categoryId', filters.categoryId);
  if (filters?.stockStatus) searchParams.set('stockStatus', filters.stockStatus);

  const res = await fetch(`${INVENTORY_AGGREGATE}?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo tồn kho theo sản phẩm (${res.status}): ${text}`);
  }
  return res.json() as Promise<InventoryProductPayload>;
}

export interface InventoryBranchPayload {
  data: InventoryBranchReportRow[];
  summary: {
    totalBranches: number;
    totalOnHand: number;
    totalInventoryValue: number;
    totalOutOfStock: number;
  };
}

export async function fetchInventoryBranchReport(): Promise<InventoryBranchPayload> {
  const res = await fetch(`${INVENTORY_AGGREGATE}?view=branch`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo tồn kho theo chi nhánh (${res.status}): ${text}`);
  }
  return res.json() as Promise<InventoryBranchPayload>;
}

export interface InventoryCategoryPayload {
  data: InventoryCategoryReportRow[];
  summary: {
    totalCategories: number;
    totalOnHand: number;
    totalInventoryValue: number;
    totalOutOfStock: number;
  };
}

export async function fetchInventoryCategoryReport(): Promise<InventoryCategoryPayload> {
  const res = await fetch(`${INVENTORY_AGGREGATE}?view=category`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Không tải được báo cáo tồn kho theo danh mục (${res.status}): ${text}`);
  }
  return res.json() as Promise<InventoryCategoryPayload>;
}
