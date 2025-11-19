/**
 * Cancel Warranty Dialog
 * Dialog để hủy phiếu bảo hành với lý do
 */

import * as React from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog.tsx';
import { Textarea } from '../../../../components/ui/textarea.tsx';
import type { WarrantyTicket, WarrantyHistory } from '../../types.ts';
import { useWarrantyStore } from '../../store.ts';
import { usePaymentStore } from '../../../payments/store.ts';
import { asSystemId } from '@/lib/id-types';
import { useReceiptStore } from '../../../receipts/store.ts';
import { useOrderStore } from '../../../orders/store.ts';
import { useAuth } from '../../../../contexts/auth-context.tsx';
import { toISODateTime, getCurrentDate } from '../../../../lib/date-utils.ts';

interface WarrantyCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
  onCancelled?: (ticket: WarrantyTicket) => void;
}

export function WarrantyCancelDialog({ open, onOpenChange, ticket, onCancelled }: WarrantyCancelDialogProps) {
  const [cancelReason, setCancelReason] = React.useState('');
  const { user: currentUser } = useAuth();
  const { update, findById, addHistory } = useWarrantyStore();
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const { data: orders } = useOrderStore();

  const handleCancel = React.useCallback(async () => {
    console.log('[CANCEL DIALOG] handleCancel called', { 
      hasTicket: !!ticket, 
      cancelReason,
      ticketId: ticket?.id 
    });
    
    if (!ticket || !cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phiếu');
      return;
    }

    try {
      const timestamp = toISODateTime(getCurrentDate());
      // ✅ ROLLBACK KHO khi hủy - Phân biệt theo trạng thái
      const { rollbackWarrantyStock, uncommitWarrantyStock } = await import('../../store/stock-management.ts');
      
      // Check nếu đã xuất kho (completed hoặc returned sau khi completed)
      const hasDeductedStock = ticket.stockDeducted || ticket.status === 'completed';
      
      if (hasDeductedStock) {
        // Đã xuất kho → Hoàn hàng về kho
        rollbackWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Rollback completed/returned warranty (restore stock):', {
          status: ticket.status,
          ticketId: ticket.id,
          stockDeducted: ticket.stockDeducted,
          products: ticket.products.filter(p => p.resolution === 'replace').length
        });
      } else if (ticket.status === 'pending' || ticket.status === 'processed') {
        // Chưa xuất kho, chỉ uncommit (giải phóng hàng giữ chỗ)
        uncommitWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Uncommit pending/processing warranty:', {
          status: ticket.status,
          ticketId: ticket.id
        });
      } else if (ticket.status === 'returned') {
        // Đã trả hàng nhưng chưa kết thúc → vẫn đang giữ hàng thay thế
        uncommitWarrantyStock(ticket);
        console.log('[CANCEL DIALOG] Uncommit returned warranty:', {
          status: ticket.status,
          ticketId: ticket.id
        });
      }
      // incomplete: không làm gì cả (chưa commit)
      
      // CANCEL ALL PAYMENT & RECEIPT VOUCHERS linked to this warranty
      const relatedPayments = payments.filter(p => 
        p.linkedWarrantySystemId === ticket.systemId && 
        p.status !== 'cancelled'
      );
      const relatedReceipts = receipts.filter(r => 
        r.linkedWarrantySystemId === ticket.systemId && 
        r.status !== 'cancelled'
      );
      
      console.log('[CANCEL DIALOG] Found transactions:', {
        payments: relatedPayments.length,
        receipts: relatedReceipts.length,
        paymentIds: relatedPayments.map(p => p.id),
        receiptIds: relatedReceipts.map(r => r.id)
      });
      
      const allVouchers = [...relatedPayments, ...relatedReceipts];
      
      if (allVouchers.length > 0) {
        const paymentStore = usePaymentStore.getState();
        const receiptStore = useReceiptStore.getState();
        const orderStore = useOrderStore.getState();
        
        const cancelledCount = { payments: 0, receipts: 0 };
        
        // Soft delete payments - update status to 'cancelled' + save cancelReason in description
        relatedPayments.forEach(payment => {
          const newDescription = `[HỦY] ${cancelReason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`;
          console.log('[CANCEL DIALOG] Saving payment with description:', {
            paymentId: payment.id,
            originalDesc: payment.description,
            newDescription,
            cancelReason
          });
          
          paymentStore.update(payment.systemId as any, {
            ...payment,
            status: 'cancelled',
            cancelledAt: timestamp,
            description: newDescription,
          });
          cancelledCount.payments++;
          console.log('[WARRANTY CANCEL] Cancelled payment:', payment.id);
          
          // ✅ UPDATE ORDER: Remove payment from order.payments and decrease paidAmount
          if (payment.linkedOrderSystemId) {
            const order = orders.find(o => o.systemId === payment.linkedOrderSystemId);
            if (order) {
              // Remove this payment from order.payments array
              const updatedPayments = order.payments.filter(p => p.systemId !== payment.systemId);
              
              // Decrease paidAmount (payment.amount is negative, so we subtract it back)
              const newPaidAmount = (order.paidAmount || 0) - Math.abs(payment.amount);
              
              console.log('[WARRANTY CANCEL] Updating order:', {
                orderId: order.id,
                oldPaidAmount: order.paidAmount,
                newPaidAmount,
                removedPayment: payment.id
              });
              
              orderStore.update(payment.linkedOrderSystemId, {
                payments: updatedPayments,
                paidAmount: Math.max(0, newPaidAmount), // Ensure not negative
              });
            }
          }
        });
        
        // Soft delete receipts - update status to 'cancelled' + save cancelReason in description
        relatedReceipts.forEach(receipt => {
          receiptStore.update(receipt.systemId as any, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: timestamp,
            description: `[HỦY] ${cancelReason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`,
          });
          cancelledCount.receipts++;
          console.log('[WARRANTY CANCEL] Cancelled receipt:', receipt.id);
        });
        
        const voucherList = allVouchers.map(v => `${v.id} (${v.amount.toLocaleString('vi-VN')}đ)`).join(', ');
        
        toast.warning(`Đã hủy ${cancelledCount.payments} phiếu chi và ${cancelledCount.receipts} phiếu thu`, {
          description: voucherList,
          duration: 5000
        });
        
        addHistory(
          ticket.systemId,
          `🗑️ Hủy ${allVouchers.length} phiếu thu/chi (${cancelledCount.payments} phiếu chi, ${cancelledCount.receipts} phiếu thu)`,
          currentUser.name,
          `Danh sách: ${voucherList}`
        );
      }
      
      // Update warranty ticket status to 'cancelled'
      const latestTicket = findById(ticket.systemId);
      if (!latestTicket) {
        toast.error('Không tìm thấy phiếu');
        return;
      }

      const newHistory: WarrantyHistory = {
        systemId: asSystemId(`history_${Date.now()}`),
        action: 'Hủy phiếu bảo hành',
        actionLabel: 'Đã hủy phiếu',
        entityType: 'status',
        performedBy: currentUser.name,
        performedAt: timestamp,
        note: `Lý do: ${cancelReason}`,
      };

      const updatedTicket: WarrantyTicket = {
        ...latestTicket,
        status: 'cancelled',
        cancelledAt: timestamp,
        cancelReason,
        linkedOrderSystemId: undefined,
        stockDeducted: false,
        history: [...latestTicket.history, newHistory],
      };

      update(ticket.systemId, updatedTicket);
      onCancelled?.(updatedTicket);
      
      onOpenChange(false);
      setCancelReason('');
      toast.success('Đã hủy phiếu bảo hành');
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      toast.error('Không thể hủy phiếu');
    }
  }, [ticket, cancelReason, update, currentUser, findById, payments, receipts, addHistory, onOpenChange, orders]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy phiếu bảo hành</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy phiếu bảo hành này? Vui lòng nhập lý do hủy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do hủy phiếu (bắt buộc)..."
          className="min-h-[100px]"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCancelReason('')}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-destructive hover:bg-destructive/90"
          >
            Hủy phiếu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
