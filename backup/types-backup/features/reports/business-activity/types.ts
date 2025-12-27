/**
 * Business Activity Reports Types
 * 
 * Định nghĩa types cho module báo cáo hoạt động kinh doanh
 */

import type { SystemId } from '@/lib/id-types';

// =====================================
// ENUMS & CONSTANTS
// =====================================

// Loại báo cáo
export type ReportType = 
  | 'sales' // Báo cáo bán hàng
  | 'delivery' // Tình hình giao hàng
  | 'returns' // Trả hàng
  | 'payments' // Thanh toán
  | 'statistics'; // Thống kê

// Nhóm theo dimension
export type GroupByOption = 
  | 'time' // Theo thời gian
  | 'employee' // Theo nhân viên
  | 'product' // Theo sản phẩm
  | 'order' // Theo đơn hàng
  | 'branch' // Theo chi nhánh
  | 'source' // Theo nguồn bán hàng
  | 'customer' // Theo khách hàng
  | 'customer-group' // Theo nhóm khách hàng
  | 'shipment' // Theo vận đơn
  | 'carrier' // Theo đối tác vận chuyển
  | 'channel' // Theo kênh bán hàng
  | 'payment-method'; // Theo phương thức thanh toán

// Khoảng thời gian nhóm
export type TimeGrouping = 
  | 'day' // Theo ngày
  | 'week' // Theo tuần
  | 'month' // Theo tháng
  | 'quarter' // Theo quý
  | 'year'; // Theo năm

// Loại biểu đồ
export type ChartType = 
  | 'bar' // Cột
  | 'line' // Đường
  | 'area' // Vùng
  | 'combo' // Kết hợp cột + đường
  | 'pie' // Tròn
  | 'donut'; // Vành khuyên

// =====================================
// FILTER TYPES
// =====================================

export interface ReportDateRange {
  from: string; // ISO date string
  to: string; // ISO date string
}

export interface ReportFilters {
  dateRange: ReportDateRange;
  reportType: ReportType;
  groupBy: GroupByOption;
  timeGrouping: TimeGrouping;
  
  // Optional filters
  branchIds?: SystemId[];
  employeeIds?: SystemId[];
  customerIds?: SystemId[];
  productIds?: SystemId[];
  categoryIds?: SystemId[];
  sourceIds?: string[];
  channelIds?: string[];
  paymentMethodIds?: string[];
  carrierIds?: SystemId[];
  orderStatuses?: string[];
  shipmentStatuses?: string[];
}

// =====================================
// DATA TYPES - BÁO CÁO BÁN HÀNG
// =====================================

// Dữ liệu báo cáo bán hàng theo thời gian (như trong hình)
export interface SalesTimeReportRow {
  key: string; // Unique key (date/week/month...)
  label: string; // Display label (20/11, 21/11...)
  
  // Metrics
  orderCount: number; // SL đơn hàng
  productAmount: number; // Tiền hàng
  returnAmount: number; // Tiền hàng trả lại
  taxAmount: number; // Tiền thuế
  shippingFee: number; // Phí giao hàng
  revenue: number; // Doanh thu = Tiền hàng - Trả lại + Phí giao + Thuế
  grossProfit: number; // Lợi nhuận gộp
  
  // Cost data (for profit calculation)
  costOfGoods?: number;
  discount?: number;
}

// Dữ liệu báo cáo bán hàng theo nhân viên
export interface SalesEmployeeReportRow {
  employeeSystemId: SystemId;
  employeeName: string;
  employeeCode?: string;
  branchName?: string;
  
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  revenue: number;
  grossProfit: number;
}

// Dữ liệu báo cáo bán hàng theo sản phẩm
export interface SalesProductReportRow {
  productSystemId: SystemId;
  productName: string;
  productCode?: string;
  sku?: string;
  categoryName?: string;
  brandName?: string;
  
  quantitySold: number;
  quantityReturned: number;
  netQuantity: number;
  productAmount: number;
  returnAmount: number;
  revenue: number;
  grossProfit: number;
  averagePrice: number;
}

// Dữ liệu báo cáo bán hàng theo đơn hàng
export interface SalesOrderReportRow {
  orderSystemId: SystemId;
  orderId: string;
  orderDate: string;
  customerSystemId?: SystemId;
  customerName?: string;
  employeeSystemId?: SystemId;
  employeeName?: string;
  branchSystemId?: SystemId;
  branchName?: string;
  status?: string;
  
  itemCount: number;
  productAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  costOfGoods: number;
  grossProfit: number;
  paidAmount: number;
  debtAmount: number;
}

// Dữ liệu báo cáo bán hàng theo chi nhánh
export interface SalesBranchReportRow {
  branchSystemId: SystemId;
  branchName: string;
  branchCode?: string;
  
  orderCount: number;
  customerCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
}

// Dữ liệu báo cáo bán hàng theo nguồn
export interface SalesSourceReportRow {
  sourceId: string;
  sourceName: string;
  
  orderCount: number;
  customerCount: number;
  productAmount: number;
  revenue: number;
  grossProfit: number;
}

// Dữ liệu báo cáo bán hàng theo khách hàng
export interface SalesCustomerReportRow {
  customerSystemId: SystemId;
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerGroup?: string;
  
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
  averageOrderValue: number;
}

// Dữ liệu báo cáo bán hàng theo nhóm khách hàng
export interface SalesCustomerGroupReportRow {
  groupId: string;
  groupName: string;
  
  customerCount: number;
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  revenue: number;
  grossProfit: number;
  averageOrderValue: number;
}

// =====================================
// DATA TYPES - TÌNH HÌNH GIAO HÀNG
// =====================================

export interface DeliveryTimeReportRow {
  key: string;
  label: string;
  
  totalShipments: number;
  deliveredCount: number;
  pendingCount: number;
  failedCount: number;
  returnedCount: number;
  
  totalAmount: number;
  codAmount: number;
  shippingFee: number;
  
  deliveryRate: number; // % giao thành công
  averageDeliveryTime?: number; // Thời gian giao hàng trung bình (giờ)
}

export interface DeliveryEmployeeReportRow {
  employeeSystemId: SystemId;
  employeeName: string;
  
  totalShipments: number;
  deliveredCount: number;
  failedCount: number;
  deliveryRate: number;
  totalAmount: number;
}

export interface DeliveryShipmentReportRow {
  shipmentSystemId: SystemId;
  shipmentId: string;
  orderId: string;
  carrierName?: string;
  status: string;
  
  createdDate: string;
  deliveredDate?: string;
  
  codAmount: number;
  shippingFee: number;
  customerName?: string;
  deliveryAddress?: string;
}

export interface DeliveryCarrierReportRow {
  carrierSystemId: SystemId;
  carrierName: string;
  
  totalShipments: number;
  deliveredCount: number;
  pendingCount: number;
  failedCount: number;
  deliveryRate: number;
  
  totalCod: number;
  totalShippingFee: number;
  averageDeliveryTime?: number;
}

export interface DeliveryBranchReportRow {
  branchSystemId: SystemId;
  branchName: string;
  
  totalShipments: number;
  deliveredCount: number;
  failedCount: number;
  deliveryRate: number;
  totalAmount: number;
}

export interface DeliveryCustomerReportRow {
  customerSystemId: SystemId;
  customerName: string;
  
  totalShipments: number;
  deliveredCount: number;
  failedCount: number;
  returnedCount: number;
  totalAmount: number;
}

export interface DeliveryChannelReportRow {
  channelId: string;
  channelName: string;
  
  totalShipments: number;
  deliveredCount: number;
  failedCount: number;
  deliveryRate: number;
  totalAmount: number;
}

// =====================================
// DATA TYPES - TRẢ HÀNG
// =====================================

export interface ReturnOrderReportRow {
  returnSystemId: SystemId;
  returnId: string;
  orderId: string;
  orderSystemId: SystemId;
  returnDate: string;
  
  customerName?: string;
  employeeName?: string;
  branchName?: string;
  
  itemCount: number;
  returnAmount: number;
  refundAmount: number;
  reason?: string;
}

export interface ReturnProductReportRow {
  productSystemId: SystemId;
  productName: string;
  productCode?: string;
  sku?: string;
  
  returnCount: number;
  quantityReturned: number;
  returnAmount: number;
  returnRate: number; // % trả so với số bán
  
  topReasons: string[];
}

// =====================================
// DATA TYPES - THANH TOÁN
// =====================================

export interface PaymentTimeReportRow {
  key: string;
  label: string;
  
  transactionCount: number;
  totalAmount: number;
  
  // By status
  completedCount: number;
  completedAmount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  failedAmount: number;
}

export interface PaymentEmployeeReportRow {
  employeeSystemId: SystemId;
  employeeName: string;
  
  transactionCount: number;
  totalAmount: number;
  averageAmount: number;
}

export interface PaymentMethodReportRow {
  methodId: string;
  methodName: string;
  
  transactionCount: number;
  totalAmount: number;
  percentage: number; // % so với tổng
}

export interface PaymentBranchReportRow {
  branchSystemId: SystemId;
  branchName: string;
  
  transactionCount: number;
  totalAmount: number;
  
  // Breakdown by method
  cashAmount: number;
  cardAmount: number;
  bankTransferAmount: number;
  otherAmount: number;
}

// =====================================
// CHART DATA
// =====================================

export interface ChartDataPoint {
  name: string;
  label?: string;
  [key: string]: string | number | undefined;
}

export interface ComboChartConfig {
  bars: {
    dataKey: string;
    name: string;
    color: string;
    stackId?: string;
  }[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
}

// =====================================
// SUMMARY / TOTALS
// =====================================

export interface SalesReportSummary {
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
}

export interface DeliveryReportSummary {
  totalShipments: number;
  deliveredCount: number;
  pendingCount: number;
  failedCount: number;
  returnedCount: number;
  deliveryRate: number;
  totalAmount: number;
  codAmount: number;
}

export interface PaymentReportSummary {
  transactionCount: number;
  totalAmount: number;
  averageAmount: number;
}

// =====================================
// EXPORT TYPES
// =====================================

export interface ReportExportConfig {
  title: string;
  subtitle?: string;
  dateRange: ReportDateRange;
  groupBy: string;
  columns: {
    key: string;
    label: string;
    type: 'string' | 'number' | 'currency' | 'percent' | 'date';
  }[];
}

// =====================================
// PAGE PROPS
// =====================================

export interface BusinessReportPageProps {
  reportType: ReportType;
  groupBy: GroupByOption;
  title: string;
  description: string;
}
