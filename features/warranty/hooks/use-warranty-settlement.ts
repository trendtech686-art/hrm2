import * as React from 'react';
import { useWarrantyStore } from '../store.ts';
import { usePaymentStore } from '../../payments/store.ts';
import { useReceiptStore } from '../../receipts/store.ts';
import { calculateWarrantyProcessingState } from '../components/logic/processing.ts';
import { calculateWarrantySettlementTotal } from '../utils/payment-calculations.ts';
import type { SettlementMethod, WarrantySettlement, WarrantyTicket } from '../types.ts';
import { asSystemId } from '@/lib/id-types';

export interface WarrantySettlementState {
  ticket: WarrantyTicket | null;
  totalPayment: number;
  remainingAmount: number;
  processingState: ReturnType<typeof calculateWarrantyProcessingState>;
  settlementSnapshot: WarrantySettlement | null;
  settlementMethods: SettlementMethod[];
  snapshotSettledAmount: number;
  snapshotRemainingAmount: number;
}

interface WarrantySettlementOptions {
  ticket?: WarrantyTicket | null;
}

export function useWarrantySettlement(
  warrantySystemId?: string | null,
  options?: WarrantySettlementOptions,
): WarrantySettlementState {
  const { findById } = useWarrantyStore();
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const overrideTicket = options?.ticket ?? null;
  const normalizedWarrantySystemId = React.useMemo(
    () => (warrantySystemId ? asSystemId(warrantySystemId) : undefined),
    [warrantySystemId],
  );

  const ticket = React.useMemo(() => {
    if (overrideTicket) {
      return overrideTicket;
    }
    if (!normalizedWarrantySystemId) return null;
    return findById(normalizedWarrantySystemId) || null;
  }, [findById, normalizedWarrantySystemId, overrideTicket]);

  const fallbackTotalPayment = React.useMemo(() => calculateWarrantySettlementTotal(ticket), [ticket]);
  const settlementSnapshot = ticket?.settlement ?? null;
  const totalPayment = settlementSnapshot?.totalAmount ?? fallbackTotalPayment;

  const settlementMethods = React.useMemo(() => {
    if (!settlementSnapshot) {
      return [];
    }

    if (settlementSnapshot.methods?.length) {
      return [...settlementSnapshot.methods].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    const fallbackType = settlementSnapshot.settlementType;
    if (!fallbackType || fallbackType === 'mixed') {
      return [];
    }

    const inferredMethod: SettlementMethod = {
      systemId: asSystemId(`${settlementSnapshot.systemId}_fallback_method`),
      type: fallbackType,
      amount: Math.abs(settlementSnapshot.totalAmount ?? totalPayment),
      status: settlementSnapshot.status,
      paymentVoucherId: settlementSnapshot.paymentVoucherId,
      debtTransactionId: settlementSnapshot.debtTransactionId,
      voucherCode: settlementSnapshot.voucherCode,
      linkedOrderSystemId: settlementSnapshot.linkedOrderSystemId,
      notes: settlementSnapshot.notes,
      createdAt: settlementSnapshot.createdAt,
      completedAt: settlementSnapshot.settledAt,
    };

    return [inferredMethod];
  }, [settlementSnapshot, totalPayment]);

  const processingState = React.useMemo(() => {
    return calculateWarrantyProcessingState(ticket, payments, receipts, totalPayment);
  }, [ticket, payments, receipts, totalPayment]);

  const snapshotSettledAmount = React.useMemo(() => {
    if (settlementSnapshot?.settledAmount != null) {
      return Math.abs(settlementSnapshot.settledAmount);
    }

    return settlementMethods
      .filter(method => method.status === 'completed')
      .reduce((sum, method) => sum + Math.abs(method.amount), 0);
  }, [settlementMethods, settlementSnapshot]);

  const snapshotRemainingAmount = React.useMemo(() => {
    if (settlementSnapshot?.remainingAmount != null) {
      return Math.abs(settlementSnapshot.remainingAmount);
    }

    return Math.max(Math.abs(totalPayment) - snapshotSettledAmount, 0);
  }, [settlementSnapshot, snapshotSettledAmount, totalPayment]);

  const remainingAmount = React.useMemo(() => {
    if (settlementSnapshot) {
      return snapshotRemainingAmount;
    }
    return Math.max(processingState.remainingAmount, 0);
  }, [processingState.remainingAmount, settlementSnapshot, snapshotRemainingAmount]);

  return {
    ticket,
    totalPayment,
    remainingAmount,
    processingState,
    settlementSnapshot,
    settlementMethods,
    snapshotSettledAmount,
    snapshotRemainingAmount,
  };
}
