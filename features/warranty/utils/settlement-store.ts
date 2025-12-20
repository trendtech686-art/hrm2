import type { SettlementMethod, SettlementStatus, SettlementType, WarrantySettlement, WarrantyTicket } from '../types';
import { useWarrantyStore } from '../store';

export interface SettlementMethodInput extends Partial<SettlementMethod> {
  type: SettlementMethod['type'];
  amount: number;
  status?: SettlementStatus;
}

import { asSystemId } from '@/lib/id-types';

const METHOD_ID_PREFIX = 'SM';
const SETTLEMENT_ID_PREFIX = 'SET';

const generateMethodId = (index: number) => asSystemId(`${METHOD_ID_PREFIX}_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`);

const normalizeMethod = (method: SettlementMethodInput, index: number): SettlementMethod => {
  const createdAt = method.createdAt ?? new Date().toISOString();
  const status = method.status ?? 'completed';
  const completedAt = status === 'completed' ? (method.completedAt ?? createdAt) : method.completedAt;

  return {
    ...method,
    amount: Math.abs(method.amount),
    systemId: method.systemId ?? generateMethodId(index),
    createdAt,
    status,
    completedAt,
  } as SettlementMethod;
};

const mergeMethods = (existing: SettlementMethod[], incoming: SettlementMethod[]): SettlementMethod[] => {
  const byId = new Map<SettlementMethod['systemId'], SettlementMethod>();
  existing.forEach(method => byId.set(method.systemId, method));
  incoming.forEach(method => byId.set(method.systemId, method));
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

const calculateProgress = (totalAmount: number, methods: SettlementMethod[]) => {
  const absoluteTotal = Math.abs(totalAmount);
  const settledAmount = methods
    .filter(method => method.status !== 'cancelled')
    .reduce((sum, method) => sum + Math.abs(method.amount), 0);
  const remainingAmount = Math.max(absoluteTotal - settledAmount, 0);
  const status: SettlementStatus = remainingAmount <= 0
    ? 'completed'
    : settledAmount > 0
      ? 'partial'
      : 'pending';

  return { settledAmount, remainingAmount, status };
};

export function recordWarrantySettlementMethods({
  ticket,
  settlementType,
  totalAmount,
  methods,
}: {
  ticket: WarrantyTicket | null;
  settlementType: SettlementType;
  totalAmount: number;
  methods: SettlementMethodInput[];
}) {
  if (!ticket || !methods.length) {
    return;
  }

  const normalizedMethods = methods.map(normalizeMethod);
  const store = useWarrantyStore.getState();
  const existingSettlement = ticket.settlement;
  const existingMethods = existingSettlement?.methods ?? [];
  const mergedMethods = mergeMethods(existingMethods, normalizedMethods);
  const now = new Date().toISOString();

  const inferredSettlementType: SettlementType =
    settlementType === 'mixed' || mergedMethods.length > 1
      ? 'mixed'
      : mergedMethods[0]?.type ?? settlementType;

  const { settledAmount, remainingAmount, status } = calculateProgress(totalAmount, mergedMethods);

  const settlement: WarrantySettlement = {
    systemId: existingSettlement?.systemId ?? asSystemId(`${SETTLEMENT_ID_PREFIX}_${Date.now()}`),
    warrantyId: ticket.systemId,
    settlementType: inferredSettlementType,
    totalAmount,
    settledAmount,
    remainingAmount,
    unsettledProducts: existingSettlement?.unsettledProducts ?? [],
    paymentVoucherId: inferredSettlementType !== 'mixed'
      ? mergedMethods.find(method => method.type === inferredSettlementType)?.paymentVoucherId ?? existingSettlement?.paymentVoucherId
      : undefined,
    debtTransactionId: existingSettlement?.debtTransactionId,
    voucherCode: existingSettlement?.voucherCode,
    linkedOrderSystemId: mergedMethods.find(method => method.type === 'order_deduction')?.linkedOrderSystemId ?? existingSettlement?.linkedOrderSystemId,
    methods: mergedMethods,
    status,
    settledAt: status === 'completed' ? (existingSettlement?.settledAt ?? now) : existingSettlement?.settledAt,
    settledBy: status === 'completed'
      ? (existingSettlement?.settledBy ?? asSystemId('SYSTEM'))
      : existingSettlement?.settledBy,
    notes: existingSettlement?.notes ?? '',
    createdAt: existingSettlement?.createdAt ?? now,
    updatedAt: now,
  };

  store.update(ticket.systemId, { settlement });
}
