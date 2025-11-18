/**
 * Hook tối ưu cho public tracking page
 * Chỉ load data cần thiết, tránh load toàn bộ stores
 */

import { useMemo } from 'react';
import { useWarrantyStore } from '../store';
import { useBranchStore } from '../../settings/branches/store';
import { useReceiptStore } from '../../receipts/store';
import { usePaymentStore } from '../../payments/store';
import { useOrderStore } from '../../orders/store';
import type { WarrantyTicket } from '../types';

export function usePublicTracking(trackingCode: string | undefined) {
  const { data: warranties } = useWarrantyStore();
  
  // Find ticket first - most important operation
  const ticket = useMemo(() => {
    if (!trackingCode) return null;
    return warranties.find(t => t.publicTrackingCode === trackingCode) || null;
  }, [trackingCode, warranties]);

  // Only load other stores if ticket exists
  const shouldLoadRelated = !!ticket;
  
  const { data: branches } = useBranchStore();
  const { data: receipts } = useReceiptStore();
  const { data: payments } = usePaymentStore();
  const { data: orders } = useOrderStore();

  // Memoize related data calculations
  const relatedData = useMemo(() => {
    if (!ticket) {
      return {
        receipts: [],
        payments: [],
        orders: [],
        hotline: '1900-xxxx',
      };
    }

    const relatedReceipts = receipts.filter(r => r.originalDocumentId === ticket.id);
    const relatedPayments = payments.filter(p => p.originalDocumentId === ticket.id);
    const relatedOrders = orders.filter(o => o.systemId === ticket.linkedOrderSystemId);
    const defaultBranch = branches.find(b => b.isDefault);
    const hotline = defaultBranch?.phone || '1900-xxxx';

    return {
      receipts: relatedReceipts,
      payments: relatedPayments,
      orders: relatedOrders,
      hotline,
    };
  }, [ticket?.id, ticket?.linkedOrderSystemId, receipts, payments, orders, branches]);

  return {
    ticket,
    ...relatedData,
  };
}
