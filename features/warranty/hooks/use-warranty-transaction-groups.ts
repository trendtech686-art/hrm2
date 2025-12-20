import * as React from 'react';
import type { WarrantyTicket, WarrantyHistory } from '../types';
import type { Payment } from '../../payments/types';
import type { Receipt } from '../../receipts/types';
import type {
  WarrantyTransaction,
  WarrantyTransactionGroup,
  WarrantyTransactionGroupSummary,
  WarrantyPaymentTransaction,
  WarrantyReceiptTransaction,
} from '../types/transactions';

interface UseWarrantyTransactionGroupsParams {
  ticket: WarrantyTicket | null | undefined;
  warrantyPayments: Payment[];
  warrantyReceipts: Receipt[];
  currentUserName: string;
}

interface SessionState {
  actions: WarrantyHistory[];
  startTime: string;
  endTime: string;
  isCancelled: boolean;
  cancelAction?: WarrantyHistory;
}

const PAYMENT_KEYWORDS = ['Tạo phiếu chi'];
const RECEIPT_KEYWORDS = ['Tạo phiếu thu'];
const CANCEL_KEYWORDS = ['Hủy'];
const REOPEN_KEYWORDS = ['Mở lại', 'Reopen'];
const CANCEL_REASON_WINDOW_MS = 60_000;
const VOUCHER_ID_REGEX = /[A-Z]{2}\d{6}/g;

const matchesKeyword = (actionLabel: string, keywords: string[]) =>
  keywords.some(keyword => actionLabel.includes(keyword));

const extractReasonFromNote = (note?: string) => {
  if (!note) return undefined;
  return note.replace(/^Lý do hủy:/i, '').replace(/^Lý do:/i, '').trim() || undefined;
};

const extractReasonFromDescription = (description?: string) => {
  if (!description) return undefined;
  const match = description.match(/\[HỦY\]\s*(.+?)(?:\s*\|\s*Gốc:|$)/);
  return match?.[1]?.trim();
};

const annotatePayment = (payment: Payment): WarrantyPaymentTransaction => ({
  ...payment,
  kind: 'payment',
});

const annotateReceipt = (receipt: Receipt): WarrantyReceiptTransaction => ({
  ...receipt,
  kind: 'receipt',
});

const buildSummary = (transactions: WarrantyTransaction[]): WarrantyTransactionGroupSummary => {
  return transactions.reduce<WarrantyTransactionGroupSummary>((summary, transaction) => {
    summary.totalTransactions += 1;

    if (transaction.kind === 'payment') {
      summary.paymentCount += 1;
      if (transaction.status !== 'cancelled') {
        summary.paymentAmount += transaction.amount;
      }
    } else {
      summary.receiptCount += 1;
      if (transaction.status !== 'cancelled') {
        summary.receiptAmount += transaction.amount;
      }
    }

    if (transaction.status === 'cancelled') {
      summary.cancelledCount += 1;
    } else if (transaction.status === 'completed') {
      summary.completedCount += 1;
    }

    return summary;
  }, {
    totalTransactions: 0,
    paymentCount: 0,
    receiptCount: 0,
    cancelledCount: 0,
    completedCount: 0,
    paymentAmount: 0,
    receiptAmount: 0,
  });
};

export function useWarrantyTransactionGroups({
  ticket,
  warrantyPayments,
  warrantyReceipts,
  currentUserName,
}: UseWarrantyTransactionGroupsParams) {
  return React.useMemo<WarrantyTransactionGroup[]>(() => {
    const relevantActions = ticket?.history?.filter(h =>
      matchesKeyword(h.action, PAYMENT_KEYWORDS) ||
      matchesKeyword(h.action, RECEIPT_KEYWORDS) ||
      matchesKeyword(h.action, CANCEL_KEYWORDS) ||
      matchesKeyword(h.action, REOPEN_KEYWORDS)
    ) || [];

    const typedPayments = warrantyPayments.map(annotatePayment);
    const typedReceipts = warrantyReceipts.map(annotateReceipt);
    const paymentById = new Map(typedPayments.map(payment => [payment.systemId as string, payment]));
    const receiptById = new Map(typedReceipts.map(receipt => [receipt.systemId as string, receipt]));

    const allTransactionsSorted: WarrantyTransaction[] = [...typedPayments, ...typedReceipts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (relevantActions.length === 0) {
      if (allTransactionsSorted.length === 0) return [];

      const summary = buildSummary(allTransactionsSorted);
      const allCancelled = summary.totalTransactions > 0 && summary.cancelledCount === summary.totalTransactions;
      const firstCancelled = allTransactionsSorted.find(t => t.status === 'cancelled');
      const cancelReason = extractReasonFromDescription(firstCancelled?.description);

      return [{
        id: 'default_group',
        transactions: allTransactionsSorted,
        allCancelled,
        cancelReason,
        createdAt: allTransactionsSorted[0].createdAt,
        performedBy: allTransactionsSorted[0].createdBy || currentUserName,
        summary,
      }];
    }

    const sortedActions = [...relevantActions].sort((a, b) =>
      new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime()
    );

    const sessions: SessionState[] = [];
    let currentSession: SessionState | null = null;

    sortedActions.forEach(action => {
      const isCancel = action.action.includes('Hủy');
      const isReopen = action.action.includes('Mở lại') || action.action.includes('Reopen');
      const isCreateVoucher = action.action.includes('Tạo phiếu chi') || action.action.includes('Tạo phiếu thu');

      if (isReopen) {
        if (currentSession) {
          sessions.push(currentSession);
        }
        currentSession = {
          actions: [],
          startTime: action.performedAt,
          endTime: action.performedAt,
          isCancelled: false,
        };
        return;
      }

      if (isCancel) {
        if (currentSession) {
          currentSession.isCancelled = true;
          currentSession.endTime = action.performedAt;
          currentSession.cancelAction = action;
          sessions.push(currentSession);
          currentSession = null;
        }
        return;
      }

      if (isCreateVoucher) {
        if (!currentSession) {
          currentSession = {
            actions: [],
            startTime: action.performedAt,
            endTime: action.performedAt,
            isCancelled: false,
          };
        }
        currentSession.actions.push(action);
        currentSession.endTime = action.performedAt;
      }
    });

    if (currentSession) {
      sessions.push(currentSession);
    }

    const groups = sessions.map((session, index) => {
      const sessionTransactions: WarrantyTransaction[] = [];

      session.actions.forEach(action => {
        const metadata = action.metadata || {};
        const paymentSystemId = metadata.paymentSystemId as string | undefined;
        const receiptSystemId = metadata.receiptSystemId as string | undefined;

        if (paymentSystemId || receiptSystemId) {
          if (paymentSystemId) {
            const payment = paymentById.get(paymentSystemId as string);
            if (payment) sessionTransactions.push(payment);
          }
          if (receiptSystemId) {
            const receipt = receiptById.get(receiptSystemId as string);
            if (receipt) sessionTransactions.push(receipt);
          }
        } else {
          const voucherIds: string[] = action.action.match(VOUCHER_ID_REGEX) || [];
          const transactions = allTransactionsSorted.filter(t => voucherIds.includes(t.id as string));
          sessionTransactions.push(...transactions);
        }
      });

      if (sessionTransactions.length === 0) return null;

      sessionTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const summary = buildSummary(sessionTransactions);
      const allCancelled = session.isCancelled || (summary.totalTransactions > 0 && summary.cancelledCount === summary.totalTransactions);
      let cancelReason: string | undefined = session.isCancelled
        ? extractReasonFromNote(session.cancelAction?.note)
        : undefined;

      if (!cancelReason && allCancelled && ticket?.history) {
        const cancelHistoryEntry = ticket.history
          .filter(h => h.action === 'Hủy phiếu bảo hành' && (h.note?.includes('Lý do hủy:') || h.note?.includes('Lý do:')))
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .find(h => {
            const historyTime = new Date(h.performedAt).getTime();
            const sessionTime = new Date(session.endTime).getTime();
            return Math.abs(historyTime - sessionTime) < CANCEL_REASON_WINDOW_MS;
          });

        cancelReason = extractReasonFromNote(cancelHistoryEntry?.note);
      }

      if (!cancelReason && allCancelled) {
        const firstCancelled = sessionTransactions.find(t => t.status === 'cancelled');
        cancelReason = extractReasonFromDescription(firstCancelled?.description);
      }

      const firstAction = session.actions[0];

      return {
        id: `session_${index}_${session.startTime}`,
        transactions: sessionTransactions,
        allCancelled,
        cancelReason,
        createdAt: session.endTime,
        performedBy: firstAction?.performedBy || currentUserName,
        summary,
      } satisfies WarrantyTransactionGroup;
    }).filter(Boolean) as WarrantyTransactionGroup[];

    return groups.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [ticket?.history, warrantyPayments, warrantyReceipts, currentUserName]);
}
