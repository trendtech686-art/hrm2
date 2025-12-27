/**
 * Reports API Layer
 */

const BASE_URL = '/api/reports';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  branchSystemId?: string;
  employeeSystemId?: string;
  categorySystemId?: string;
  brandSystemId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// Sales Report
export interface SalesReportData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ productName: string; quantity: number; revenue: number }>;
  salesByPeriod: Array<{ period: string; revenue: number; orders: number }>;
  salesByBranch: Array<{ branchName: string; revenue: number; orders: number }>;
}

export async function fetchSalesReport(filters: ReportFilters = {}): Promise<SalesReportData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}/sales?${params}` : `${BASE_URL}/sales`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Inventory Report
export interface InventoryReportData {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: Array<{ productName: string; currentStock: number; minStock: number }>;
  stockByCategory: Array<{ categoryName: string; quantity: number; value: number }>;
  stockMovement: Array<{ period: string; inbound: number; outbound: number }>;
}

export async function fetchInventoryReport(filters: ReportFilters = {}): Promise<InventoryReportData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}/inventory?${params}` : `${BASE_URL}/inventory`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Customer SLA Report
export interface CustomerSlaReportData {
  totalCustomers: number;
  overdueFollowups: number;
  overdueReEngagements: number;
  overduePayments: number;
  slaBreakdown: Array<{ slaType: string; onTime: number; overdue: number; percentage: number }>;
}

export async function fetchCustomerSlaReport(filters: ReportFilters = {}): Promise<CustomerSlaReportData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}/customer-sla?${params}` : `${BASE_URL}/customer-sla`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Product SLA Report
export interface ProductSlaReportData {
  totalProducts: number;
  warrantyDue: number;
  returnRate: number;
  complaintRate: number;
  productPerformance: Array<{ productName: string; salesCount: number; returnCount: number; complaintCount: number }>;
}

export async function fetchProductSlaReport(filters: ReportFilters = {}): Promise<ProductSlaReportData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}/product-sla?${params}` : `${BASE_URL}/product-sla`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Business Activity Report
export interface BusinessActivityData {
  summary: { orders: number; receipts: number; payments: number; stockTransfers: number };
  activityTimeline: Array<{ date: string; type: string; count: number; amount: number }>;
}

export async function fetchBusinessActivityReport(filters: ReportFilters = {}): Promise<BusinessActivityData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}/business-activity?${params}` : `${BASE_URL}/business-activity`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
