import type { Customer } from '../types';
import type { CustomerSlaSetting, CustomerSlaType } from '../../settings/customers/types';
import type { SystemId } from '@/lib/id-types';

export type SlaAlertLevel = 'normal' | 'warning' | 'critical' | 'overdue';

export interface CustomerSlaAlert {
  systemId: Customer['systemId'];
  customer: Customer;
  slaType: CustomerSlaType;
  slaName: string;
  daysRemaining: number;
  alertLevel: SlaAlertLevel;
  targetDate: string;
  lastActivityDate?: string;
  assignee?: string;
}

export interface DebtAlert {
  systemId: Customer['systemId'];
  customer: Customer;
  totalDebt: number;
  overdueAmount: number;
  daysOverdue: number;
  debtStatus: NonNullable<Customer['debtStatus']>;
  oldestDueDate?: string;
}

export interface CustomerHealthAlert {
  systemId: Customer['systemId'];
  customer: Customer;
  healthScore: number;
  churnRisk: NonNullable<Customer['churnRisk']>;
  segment?: string;
  daysSinceLastPurchase: number;
  totalOrders: number;
  totalSpent: number;
}

export interface CustomerSlaIndexEntry {
  customer: Customer;
  alerts: CustomerSlaAlert[];
  debtAlert?: DebtAlert;
  healthAlert?: CustomerHealthAlert;
}

export interface CustomerSlaIndex {
  entries: Record<SystemId, CustomerSlaIndexEntry>;
  followUpAlerts: CustomerSlaAlert[];
  reEngagementAlerts: CustomerSlaAlert[];
  debtAlerts: DebtAlert[];
  healthAlerts: CustomerHealthAlert[];
}

export interface ReportSummary {
  totalCustomers: number;
  followUpAlerts: number;
  reEngagementAlerts: number;
  debtAlerts: number;
  healthAlerts: number;
  criticalCount: number;
  /** Internal: used to trigger re-renders when acknowledge happens */
  _lastAckAt?: string;
}

export type SlaActionType = 'acknowledged' | 'snoozed' | 'resolved' | 'escalated';

export interface CustomerSlaAcknowledgement {
  slaType: CustomerSlaType;
  targetDate: string;
  acknowledgedAt: string;
  actionType: SlaActionType;
  snoozeUntil?: string; // ISO date string for snooze
  notes?: string;
}

export interface SlaActivityLog {
  id: string;
  customerId: SystemId;
  slaType: CustomerSlaType;
  actionType: SlaActionType;
  performedAt: string;
  performedBy?: string;
  notes?: string;
  previousState?: {
    daysRemaining: number;
    alertLevel: SlaAlertLevel;
  };
}

export type CustomerSlaAckMap = Record<SystemId, Partial<Record<CustomerSlaType, CustomerSlaAcknowledgement>>>;

export type { CustomerSlaType };
