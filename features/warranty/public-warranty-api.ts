import type { WarrantyTicket, WarrantyProduct, WarrantyHistory, SettlementMethod } from './types.ts';
import type { Payment } from '../payments/types.ts';
import type { Receipt } from '../receipts/types.ts';
import type { Order } from '../orders/types.ts';
import { useWarrantyStore } from './store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { useOrderStore } from '../orders/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';

export interface PublicWarrantyProduct extends Pick<WarrantyProduct, 'systemId' | 'productName' | 'quantity' | 'resolution' | 'unitPrice' | 'deductionAmount' | 'issueDescription'> {
  productImages: string[];
}

export interface PublicWarrantyHistory extends Pick<WarrantyHistory, 'systemId' | 'action' | 'actionLabel' | 'performedAt' | 'performedBy' | 'note'> {}

export interface PublicSettlementMethod extends Pick<SettlementMethod, 'systemId' | 'type' | 'amount' | 'status' | 'notes' | 'linkedOrderSystemId' | 'paymentVoucherId' | 'createdAt'> {}

export interface PublicWarrantyTicket extends Pick<
  WarrantyTicket,
  | 'systemId'
  | 'id'
  | 'status'
  | 'customerName'
  | 'customerPhone'
  | 'customerAddress'
  | 'trackingCode'
  | 'publicTrackingCode'
  | 'shippingFee'
  | 'receivedImages'
  | 'processedImages'
  | 'summary'
  | 'notes'
  | 'linkedOrderSystemId'
  | 'createdAt'
  | 'processingStartedAt'
  | 'processedAt'
  | 'returnedAt'
  | 'completedAt'
  | 'cancelledAt'
  | 'cancelReason'
  | 'employeeName'
> {
  products: PublicWarrantyProduct[];
  history: PublicWarrantyHistory[];
  settlement?: {
    totalAmount: number;
    settledAmount: number;
    remainingAmount: number;
    methods: PublicSettlementMethod[];
  };
}

export interface PublicWarrantyPayment extends Pick<Payment, 'systemId' | 'id' | 'amount' | 'createdAt' | 'paymentMethodName' | 'linkedOrderSystemId' | 'description' | 'status'> {}

export interface PublicWarrantyReceipt extends Pick<Receipt, 'systemId' | 'id' | 'amount' | 'createdAt' | 'paymentMethodName' | 'description' | 'status'> {}

export interface PublicWarrantyOrder extends Pick<Order, 'systemId' | 'id' | 'customerName'> {}

export interface PublicWarrantyResponse {
  ticket: PublicWarrantyTicket;
  payments: PublicWarrantyPayment[];
  receipts: PublicWarrantyReceipt[];
  orders: PublicWarrantyOrder[];
  hotline: string;
}

function sanitizeTicket(ticket: WarrantyTicket): PublicWarrantyTicket {
  const settlementMethods: PublicSettlementMethod[] = ticket.settlement?.methods
    ?.filter(method => method.status === 'completed')
    .map(method => ({
      systemId: method.systemId,
      type: method.type,
      amount: Math.abs(method.amount),
      status: method.status,
      notes: method.notes,
      linkedOrderSystemId: method.linkedOrderSystemId,
      paymentVoucherId: method.paymentVoucherId,
      createdAt: method.createdAt,
    })) ?? [];

  return {
    systemId: ticket.systemId,
    id: ticket.id,
    status: ticket.status,
    customerName: ticket.customerName,
    customerPhone: ticket.customerPhone,
    customerAddress: ticket.customerAddress,
    trackingCode: ticket.trackingCode,
    publicTrackingCode: ticket.publicTrackingCode,
    shippingFee: ticket.shippingFee,
    products: (ticket.products || []).map(product => ({
      systemId: product.systemId,
      productName: product.productName,
      quantity: product.quantity,
      resolution: product.resolution,
      unitPrice: product.unitPrice,
      deductionAmount: product.deductionAmount,
      issueDescription: product.issueDescription,
      productImages: product.productImages || [],
    })),
    receivedImages: ticket.receivedImages || [],
    processedImages: ticket.processedImages,
    summary: ticket.summary,
    notes: ticket.notes,
    linkedOrderSystemId: ticket.linkedOrderSystemId,
    createdAt: ticket.createdAt,
    processingStartedAt: ticket.processingStartedAt,
    processedAt: ticket.processedAt,
    returnedAt: ticket.returnedAt,
    completedAt: ticket.completedAt,
    cancelledAt: ticket.cancelledAt,
    cancelReason: ticket.cancelReason,
    employeeName: ticket.employeeName,
    history: (ticket.history || []).map(entry => ({
      systemId: entry.systemId,
      action: entry.action,
      actionLabel: entry.actionLabel || entry.action,
      performedAt: entry.performedAt,
      performedBy: entry.performedBy,
      note: entry.note,
    })),
    settlement: ticket.settlement
      ? {
          totalAmount: ticket.settlement.totalAmount,
          settledAmount: ticket.settlement.settledAmount,
          remainingAmount: ticket.settlement.remainingAmount,
          methods: settlementMethods,
        }
      : undefined,
  };
}

export async function fetchPublicWarrantyTicket(trackingCode: string): Promise<PublicWarrantyResponse | null> {
  const warrantyStore = useWarrantyStore.getState();
  const ticket = warrantyStore.data.find(item => item.publicTrackingCode === trackingCode);
  if (!ticket) {
    return null;
  }

  const paymentsStore = usePaymentStore.getState();
  const receiptsStore = useReceiptStore.getState();
  const ordersStore = useOrderStore.getState();
  const branchStore = useBranchStore.getState();

  const relatedPayments = paymentsStore.data
    .filter(payment => payment.linkedWarrantySystemId === ticket.systemId && payment.status !== 'cancelled')
    .map(payment => ({
      systemId: payment.systemId,
      id: payment.id,
      amount: payment.amount,
      createdAt: payment.createdAt,
      paymentMethodName: payment.paymentMethodName,
      linkedOrderSystemId: payment.linkedOrderSystemId,
      description: payment.description,
      status: payment.status,
    })) as PublicWarrantyPayment[];

  const relatedReceipts = receiptsStore.data
    .filter(receipt => receipt.linkedWarrantySystemId === ticket.systemId && receipt.status !== 'cancelled')
    .map(receipt => ({
      systemId: receipt.systemId,
      id: receipt.id,
      amount: receipt.amount,
      createdAt: receipt.createdAt,
      paymentMethodName: receipt.paymentMethodName,
      description: receipt.description,
      status: receipt.status,
    })) as PublicWarrantyReceipt[];

  const linkedOrderIds = new Set<string>();
  if (ticket.linkedOrderSystemId) {
    linkedOrderIds.add(ticket.linkedOrderSystemId);
  }
  relatedPayments.forEach(payment => {
    if (payment.linkedOrderSystemId) {
      linkedOrderIds.add(payment.linkedOrderSystemId);
    }
  });

  const relatedOrders = ordersStore.data
    .filter(order => linkedOrderIds.has(order.systemId))
    .map(order => ({
      systemId: order.systemId,
      id: order.id,
      customerName: order.customerName,
    })) as PublicWarrantyOrder[];

  const branchHotline = branchStore.data.find(branch => branch.systemId === ticket.branchSystemId)?.phone;
  const defaultBranchHotline = branchStore.data.find(branch => branch.isDefault)?.phone;
  const hotline = branchHotline || defaultBranchHotline || '1900-xxxx';

  return {
    ticket: sanitizeTicket(ticket),
    payments: relatedPayments,
    receipts: relatedReceipts,
    orders: relatedOrders,
    hotline,
  };
}
