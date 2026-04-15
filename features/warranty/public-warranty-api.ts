import type { WarrantyTicket, WarrantyProduct, WarrantyHistory, SettlementMethod } from './types';
import type { Payment } from '../payments/types';
import type { Receipt } from '../receipts/types';
import type { Order } from '../orders/types';

export interface PublicWarrantyProduct extends Pick<WarrantyProduct, 'systemId' | 'productName' | 'quantity' | 'resolution' | 'unitPrice' | 'deductionAmount' | 'issueDescription' | 'notes'> {
  sku: string | null;
  productImages: string[];
  catalogImage: string | null;
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
  | 'branchName'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy'
> {
  products: PublicWarrantyProduct[];
  history: PublicWarrantyHistory[];
  settlement?: {
    totalAmount: number;
    settledAmount: number;
    remainingAmount: number;
    methods: PublicSettlementMethod[];
  } | undefined;
}

export interface PublicWarrantyPayment extends Pick<Payment, 'systemId' | 'id' | 'amount' | 'createdAt' | 'paymentMethodName' | 'linkedOrderSystemId' | 'description' | 'status'> {}

export interface PublicWarrantyReceipt extends Pick<Receipt, 'systemId' | 'id' | 'amount' | 'createdAt' | 'paymentMethodName' | 'description' | 'status'> {}

export interface PublicWarrantyOrder extends Pick<Order, 'systemId' | 'id' | 'customerName'> {}

export interface PublicWarrantyComment {
  systemId: string;
  content: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
}

export interface PublicWarrantyResponse {
  ticket: PublicWarrantyTicket;
  comments: PublicWarrantyComment[];
  payments: PublicWarrantyPayment[];
  receipts: PublicWarrantyReceipt[];
  orders: PublicWarrantyOrder[];
  hotline: string;
  companyName?: string;
  settings?: {
    enabled: boolean;
    showEmployeeName: boolean;
    showTimeline: boolean;
    allowCustomerComments: boolean;
    showProductList: boolean;
    showSummary: boolean;
    showPayment: boolean;
    showReceivedImages: boolean;
    showProcessedImages: boolean;
    showHistory: boolean;
  };
}

function _sanitizeTicket(ticket: WarrantyTicket): PublicWarrantyTicket {
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
      sku: (product.sku as string) || null,
      quantity: product.quantity,
      resolution: product.resolution,
      unitPrice: product.unitPrice,
      deductionAmount: product.deductionAmount,
      issueDescription: product.issueDescription,
      notes: product.notes,
      productImages: product.productImages || [],
      catalogImage: null,
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
    branchName: ticket.branchName || '',
    createdBy: ticket.createdBy,
    updatedAt: ticket.updatedAt,
    updatedBy: ticket.updatedBy,
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

/**
 * @deprecated This function is unused. Public warranty tracking uses
 * the API endpoint /api/public/warranty-tracking via use-public-tracking.ts hook.
 * Kept only for reference.
 */
// fetchPublicWarrantyTicket function was removed - it relied on deprecated Zustand stores.
// Use the server-side API endpoint instead.
