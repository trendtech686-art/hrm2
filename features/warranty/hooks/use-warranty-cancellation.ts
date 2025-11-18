import * as React from 'react';
import { toast } from 'sonner';
import { toISODateTime, getCurrentDate } from '../../../lib/date-utils.ts';
import { useAuth } from '../../../contexts/auth-context.tsx';
import { useWarrantyStore } from '../store.ts';
import { usePaymentStore } from '../../payments/store.ts';
import { useReceiptStore } from '../../receipts/store.ts';
import { useOrderStore } from '../../orders/store.ts';
import type { WarrantyHistory, WarrantyTicket } from '../types.ts';

interface CancelWarrantyOptions {
  ticket: WarrantyTicket | null;
  reason: string;
}

export function useWarrantyCancellation() {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const { user: currentUser } = useAuth();
  const { update, findById, addHistory } = useWarrantyStore();
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const { data: orders } = useOrderStore();

  const cancelWarranty = React.useCallback(async ({ ticket, reason }: CancelWarrantyOptions) => {
    console.log('[CANCEL DIALOG] cancelWarranty called', {
      hasTicket: !!ticket,
      reason,
      ticketId: ticket?.id,
    });

    if (!ticket || !reason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phiếu');
      return false;
    }

    setIsCancelling(true);

    try {
      const { rollbackWarrantyStock, uncommitWarrantyStock } = await import('../store/stock-management.ts');

      const hasDeductedStock = ticket.stockDeducted || ticket.status === 'completed';

      if (hasDeductedStock) {
        rollbackWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Rollback completed/returned warranty (restore stock):', {
          status: ticket.status,
          ticketId: ticket.id,
          stockDeducted: ticket.stockDeducted,
          products: ticket.products.filter(p => p.resolution === 'replace').length,
        });
      } else if (ticket.status === 'pending' || ticket.status === 'processed') {
        uncommitWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Uncommit pending/processing warranty:', {
          status: ticket.status,
          ticketId: ticket.id,
        });
      } else if (ticket.status === 'returned') {
        uncommitWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Uncommit returned warranty:', {
          status: ticket.status,
          ticketId: ticket.id,
        });
      }

      const relatedPayments = payments.filter(p => p.linkedWarrantySystemId === ticket.systemId && p.status !== 'cancelled');
      const relatedReceipts = receipts.filter(r => r.linkedWarrantySystemId === ticket.systemId && r.status !== 'cancelled');

      console.log('[CANCEL DIALOG] Found transactions:', {
        payments: relatedPayments.length,
        receipts: relatedReceipts.length,
        paymentIds: relatedPayments.map(p => p.id),
        receiptIds: relatedReceipts.map(r => r.id),
      });

      const allVouchers = [...relatedPayments, ...relatedReceipts];

      if (allVouchers.length > 0) {
        const paymentStore = usePaymentStore.getState();
        const receiptStore = useReceiptStore.getState();
        const orderStore = useOrderStore.getState();

        const cancelledCount = { payments: 0, receipts: 0 };
        const now = toISODateTime(getCurrentDate());

        relatedPayments.forEach(payment => {
          const newDescription = `[HỦY] ${reason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`;
          console.log('[CANCEL DIALOG] Saving payment with description:', {
            paymentId: payment.id,
            originalDesc: payment.description,
            newDescription,
            reason,
          });

          paymentStore.update(payment.systemId as any, {
            ...payment,
            status: 'cancelled',
            cancelledAt: now,
            description: newDescription,
          });
          cancelledCount.payments++;
          console.log('[WARRANTY CANCEL] Cancelled payment:', payment.id);

          if (payment.linkedOrderSystemId) {
            const order = orders.find(o => o.systemId === payment.linkedOrderSystemId);
            if (order) {
              const updatedPayments = order.payments.filter(p => p.systemId !== payment.systemId);
              const newPaidAmount = (order.paidAmount || 0) - Math.abs(payment.amount);

              console.log('[WARRANTY CANCEL] Updating order:', {
                orderId: order.id,
                oldPaidAmount: order.paidAmount,
                newPaidAmount,
                removedPayment: payment.id,
              });

              orderStore.update(payment.linkedOrderSystemId, {
                payments: updatedPayments,
                paidAmount: Math.max(0, newPaidAmount),
              });
            }
          }
        });

        relatedReceipts.forEach(receipt => {
          receiptStore.update(receipt.systemId as any, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: now,
            description: `[HỦY] ${reason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`,
          });
          cancelledCount.receipts++;
          console.log('[WARRANTY CANCEL] Cancelled receipt:', receipt.id);
        });

        const voucherList = allVouchers.map(v => `${v.id} (${v.amount.toLocaleString('vi-VN')}đ)`).join(', ');

        toast.warning(`Đã hủy ${cancelledCount.payments} phiếu chi và ${cancelledCount.receipts} phiếu thu`, {
          description: voucherList,
          duration: 5000,
        });

        addHistory(
          ticket.systemId,
          `Hủy ${allVouchers.length} phiếu thu/chi (${cancelledCount.payments} phiếu chi, ${cancelledCount.receipts} phiếu thu)`,
          currentUser.name,
          `Danh sách: ${voucherList}`,
        );
      }

      const latestTicket = findById(ticket.systemId);
      if (!latestTicket) {
        toast.error('Không tìm thấy phiếu');
        return false;
      }

      const newHistory: WarrantyHistory = {
        systemId: `history_${Date.now()}`,
        action: 'Hủy phiếu bảo hành',
        actionLabel: 'Đã hủy phiếu',
        entityType: 'status',
        performedBy: currentUser.name,
        performedAt: toISODateTime(getCurrentDate()),
        note: `Lý do: ${reason}`,
      };

      update(ticket.systemId, {
        status: 'cancelled',
        cancelledAt: toISODateTime(getCurrentDate()),
        cancelReason: reason,
        linkedOrderSystemId: undefined,
        stockDeducted: false,
        history: [...latestTicket.history, newHistory],
      });

      toast.success('Đã hủy phiếu bảo hành');
      return true;
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      toast.error('Không thể hủy phiếu');
      return false;
    } finally {
      setIsCancelling(false);
    }
  }, [payments, receipts, orders, addHistory, currentUser.name, findById, update]);

  return { cancelWarranty, isCancelling };
}
