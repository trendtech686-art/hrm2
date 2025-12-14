import type { Customer, DebtStatus } from '../../customers/types';
import type { CustomerSlaSetting } from '../../settings/customers/types';

export type SlaAlertLevel = 'normal' | 'warning' | 'critical' | 'overdue';

export interface CustomerSlaAlert {
  systemId: string; // Customer's systemId for table row identification
  customer: Customer;
  slaType: CustomerSlaSetting['slaType'];
  slaName: string;
  daysRemaining: number; // Số ngày còn lại (âm = quá hạn)
  alertLevel: SlaAlertLevel;
  targetDate: string; // Ngày mục tiêu
  lastActivityDate?: string; // Ngày hoạt động cuối
  assignee?: string; // Người phụ trách
}

export interface DebtAlert {
  systemId: string; // Customer's systemId for table row identification
  customer: Customer;
  totalDebt: number;
  overdueAmount: number;
  daysOverdue: number;
  debtStatus: DebtStatus;
  oldestDueDate?: string;
}

export interface CustomerHealthAlert {
  systemId: string; // Customer's systemId for table row identification
  customer: Customer;
  healthScore: number;
  churnRisk: 'low' | 'medium' | 'high';
  segment?: string;
  daysSinceLastPurchase: number;
  totalOrders: number;
  totalSpent: number;
}

export type ReportTab = 'follow-up' | 're-engagement' | 'debt' | 'health' | 'all';

export interface ReportSummary {
  totalCustomers: number;
  followUpAlerts: number;
  reEngagementAlerts: number;
  debtAlerts: number;
  healthAlerts: number;
  criticalCount: number;
}
