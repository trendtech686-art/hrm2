// Re-export all customer SLA report types from prisma-extended
export type {
  SlaAlertLevel,
  CustomerSlaAlert,
  DebtAlert,
  CustomerHealthAlert,
  ReportSummary,
} from '@/lib/types/prisma-extended';

export type ReportTab = 'follow-up' | 're-engagement' | 'debt' | 'health' | 'all';

