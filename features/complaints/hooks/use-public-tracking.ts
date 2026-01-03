/**
 * Hook tối ưu cho public complaint tracking page
 * Chỉ load data cần thiết, tránh load toàn bộ stores
 */

import { useMemo } from 'react';
import { useComplaintStore } from '../store';
import { useBranchStore } from '../../settings/branches/store';
import { useAllEmployees } from '../../employees/hooks/use-all-employees';
import { usePaymentStore } from '../../payments/store';
import { useReceiptStore } from '../../receipts/store';
import { useAllOrders } from '../../orders/hooks/use-all-orders';

export function usePublicComplaintTracking(complaintId: string | undefined) {
  const { complaints } = useComplaintStore();
  
  // Find complaint first - most important operation
  const complaint = useMemo(() => {
    if (!complaintId) return null;
    return complaints.find(c => 
      c.publicTrackingCode === complaintId || 
      c.systemId === complaintId || 
      c.id === complaintId
    ) || null;
  }, [complaintId, complaints]);

  // Only load other stores if complaint exists
  const { data: branches } = useBranchStore();
  const { data: _employees } = useAllEmployees();
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const { data: orders } = useAllOrders();

  // Memoize related data calculations
  const relatedData = useMemo(() => {
    if (!complaint) {
      return {
        defaultBranch: null,
        hotline: '1900-xxxx',
        companyName: 'Công ty',
        compensationPayment: null,
        compensationReceipt: null,
        relatedOrder: null,
      };
    }

    // Find verified-correct action
    const verifiedCorrectAction = [...complaint.timeline]
      .reverse()
      .find(a => a.actionType === 'verified-correct');

    const metadata = verifiedCorrectAction?.metadata;
    const payment = metadata?.paymentSystemId
      ? payments.find(p => p.systemId === metadata.paymentSystemId)
      : null;

    const receipt = metadata?.receiptSystemId
      ? receipts.find(r => r.systemId === metadata.receiptSystemId)
      : null;

    const defaultBranch = branches.find(b => b.isDefault);
    
    // Find related order
    const relatedOrder = orders.find(o => o.systemId === complaint.orderSystemId);

    return {
      defaultBranch,
      hotline: defaultBranch?.phone || '1900-xxxx',
      companyName: defaultBranch?.name || 'Công ty',
      compensationPayment: payment || null,
      compensationReceipt: receipt || null,
      relatedOrder: relatedOrder || null,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally tracking specific complaint properties only
  }, [complaint?.timeline, complaint?.orderSystemId, payments, receipts, branches, orders]);

  // Memoize comments
  const comments = useMemo(() => {
    if (!complaint?.timeline) return [];
    return complaint.timeline
      .filter(action => action.actionType === 'commented')
      .map(action => ({
        systemId: action.id,
        content: action.note || '',
        contentText: action.note || '',
        createdBy: action.performedBy,
        createdBySystemId: action.performedBy,
        createdAt: action.performedAt instanceof Date 
          ? action.performedAt.toISOString() 
          : action.performedAt,
        attachments: action.images || [],
        mentions: [],
        isEdited: false,
        parentId: undefined,
      }));
  }, [complaint?.timeline]);

  // Memoize timeline actions (exclude comments)
  const timelineActions = useMemo(() => {
    if (!complaint?.timeline) return [];
    return complaint.timeline.filter(action => action.actionType !== 'commented');
  }, [complaint?.timeline]);

  return {
    complaint,
    ...relatedData,
    comments,
    timelineActions,
  };
}
