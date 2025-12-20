import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';

export type WarrantyTransactionKind = 'payment' | 'receipt';

interface WarrantyTransactionBase {
  kind: WarrantyTransactionKind;
}

export type WarrantyPaymentTransaction = Payment & WarrantyTransactionBase;
export type WarrantyReceiptTransaction = Receipt & WarrantyTransactionBase;

export type WarrantyTransaction = WarrantyPaymentTransaction | WarrantyReceiptTransaction;

export interface WarrantyTransactionGroupSummary {
  totalTransactions: number;
  paymentCount: number;
  receiptCount: number;
  cancelledCount: number;
  completedCount: number;
  paymentAmount: number;
  receiptAmount: number;
}

export interface WarrantyTransactionGroup {
  id: string;
  transactions: WarrantyTransaction[];
  allCancelled: boolean;
  cancelReason?: string | undefined;
  createdAt: string;
  performedBy: string;
  summary: WarrantyTransactionGroupSummary;
}
