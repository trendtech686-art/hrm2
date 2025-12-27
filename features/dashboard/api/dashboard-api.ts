/**
 * Dashboard API Layer
 */

const BASE_URL = '/api/dashboard';

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  branchSystemId?: string;
}

export interface DashboardSummary {
  todaySales: number;
  todayOrders: number;
  todayReceipts: number;
  pendingOrders: number;
  lowStockProducts: number;
  pendingComplaints: number;
  overdueDebts: number;
}

export interface SalesChartData {
  labels: string[];
  data: number[];
}

export interface TopProduct {
  systemId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  salesChart: SalesChartData;
  topProducts: TopProduct[];
  recentOrders: Array<{ id: string; customerName: string; total: number; status: string; date: string }>;
  alerts: Array<{ type: string; message: string; count: number }>;
}

export async function fetchDashboardData(filters: DashboardFilters = {}): Promise<DashboardData> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchDashboardSummary(filters: DashboardFilters = {}): Promise<DashboardSummary> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const res = await fetch(`${BASE_URL}/summary?${params}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchDebtAlerts(): Promise<Array<{ customerName: string; amount: number; dayOverdue: number }>> {
  const res = await fetch(`${BASE_URL}/debt-alerts`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
