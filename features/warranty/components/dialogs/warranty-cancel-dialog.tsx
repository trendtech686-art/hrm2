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
} from '../../../../components/ui/alert-dialog';
import { Textarea } from '../../../../components/ui/textarea';
import type { WarrantyTicket, WarrantyHistory } from '../../types';
import { useWarrantyMutations } from '../../hooks/use-warranties';
import { useWarrantyFinder } from '../../hooks/use-all-warranties';
import { asSystemId } from '@/lib/id-types';
import { useAllReceipts } from '../../../receipts/hooks/use-all-receipts';
import { useAllOrders } from '../../../orders/hooks/use-all-orders';
import { usePaymentMutations } from '../../../payments/hooks/use-payments';
import { useReceiptMutations } from '../../../receipts/hooks/use-receipts';
import { useOrderMutations } from '../../../orders/hooks/use-order-mutations';
import { useAuth } from '../../../../contexts/auth-context';
import { toISODateTime, getCurrentDate } from '../../../../lib/date-utils';

interface WarrantyCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
  onCancelled?: (ticket: WarrantyTicket) => void;
}

export function WarrantyCancelDialog({ open, onOpenChange, ticket, onCancelled }: WarrantyCancelDialogProps) {
  const [cancelReason, setCancelReason] = React.useState('');
  const { user: currentUser } = useAuth();
  const { update: updateWarranty } = useWarrantyMutations({
    onUpdateSuccess: () => toast.success('Đã hủy phiếu bảo hành'),
    onError: (err) => toast.error(err.message)
  });
  const { update: updatePayment } = usePaymentMutations();
  const { update: updateReceipt } = useReceiptMutations();
  const { update: updateOrder } = useOrderMutations();
  const { findById } = useWarrantyFinder();
  const { data: allPayments = [] } = useAllReceipts();
  const { data: receipts = [] } = useAllReceipts();
  const { data: orders = [] } = useAllOrders();

  const handleCancel = React.useCallback(async () => {
    
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    if (!ticket || !cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phiếu');
      return;
    }

    try {
      const timestamp = toISODateTime(getCurrentDate());
      // ✅ ROLLBACK KHO khi hủy - Phân biệt theo trạng thái
      const { rollbackWarrantyStock, uncommitWarrantyStock } = await import('../../store/stock-management');
      
      // Check nếu đã xuất kho (completed hoặc returned sau khi completed)
      const hasDeductedStock = ticket.stockDeducted || ticket.status === 'completed';
      
      if (hasDeductedStock) {
        // Đã xuất kho → Hoàn hàng về kho
        (rollbackWarrantyStock as any)(ticket, ticket.systemId);
      } else if (ticket.status === 'pending' || ticket.status === 'processed') {
        // Chưa xuất kho, chỉ uncommit (giải phóng hàng giữ chỗ)
        (uncommitWarrantyStock as any)(ticket, ticket.systemId);
      } else if (ticket.status === 'returned') {
        // Đã trả hàng nhưng chưa kết thúc → vẫn đang giữ hàng thay thế
        (uncommitWarrantyStock as any)(ticket, ticket.systemId);
      }
      // incomplete: không làm gì cả (chưa commit)
      
      // CANCEL ALL PAYMENT & RECEIPT VOUCHERS linked to this warranty
      const relatedPayments = allPayments.filter(p => 
        p.linkedWarrantySystemId === ticket.systemId && 
        p.status !== 'cancelled'
      );
      const relatedReceipts = receipts.filter(r => 
        r.linkedWarrantySystemId === ticket.systemId && 
        r.status !== 'cancelled'
      );
      
      
      const allVouchers = [...relatedPayments, ...relatedReceipts];
      
      if (allVouchers.length > 0) {
        const cancelledCount = { payments: 0, receipts: 0 };
        
        // Soft delete payments - update status to 'cancelled' + save cancelReason in description
        relatedPayments.forEach(payment => {
          const newDescription = `[HỦY] ${cancelReason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`;
          
          (updatePayment as any).mutate({
            systemId: payment.systemId,
            status: 'cancelled',
            cancelledAt: timestamp,
            description: newDescription,
          });
          cancelledCount.payments++;
          
          // ✅ UPDATE ORDER: Remove payment from order.payments and decrease paidAmount
          if (payment.linkedOrderSystemId) {
            const order = orders.find(o => o.systemId === payment.linkedOrderSystemId);
            if (order) {
              // Remove this payment from order.payments array
              const updatedPayments = order.payments.filter(p => p.systemId !== payment.systemId);
              
              // Decrease paidAmount (payment.amount is negative, so we subtract it back)
              const newPaidAmount = (order.paidAmount || 0) - Math.abs(payment.amount);
              
              
              updateOrder.mutate({
                id: payment.linkedOrderSystemId,
                payments: updatedPayments,
                paidAmount: Math.max(0, newPaidAmount), // Ensure not negative
              });
            }
          }
        });
        
        // Soft delete receipts - update status to 'cancelled' + save cancelReason in description
        relatedReceipts.forEach(receipt => {
          updateReceipt.mutate({
            systemId: receipt.systemId,
            data: {
              ...receipt,
              status: 'cancelled',
              cancelledAt: timestamp,
              description: `[HỦY] ${cancelReason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`,
            }
          });
          cancelledCount.receipts++;
        });
        
        const voucherList = allVouchers.map(v => `${v.id} (${v.amount.toLocaleString('vi-VN')}đ)`).join(', ');
        
        toast.warning(`Đã hủy ${cancelledCount.payments} phiếu chi và ${cancelledCount.receipts} phiếu thu`, {
          description: voucherList,
          duration: 5000
        });
        
        const addHistory = (_systemId: string, _action: string, _user: string, _note?: string) => {};
        addHistory(
          ticket.systemId,
          `🗑️ Hủy ${allVouchers.length} phiếu thu/chi (${cancelledCount.payments} phiếu chi, ${cancelledCount.receipts} phiếu thu)`,
          currentUser.name ?? 'Unknown',
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
        performedBy: currentUser.name ?? 'Unknown',
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

      (updateWarranty as any).mutate({ systemId: ticket.systemId, data: updatedTicket });
      onCancelled?.(updatedTicket);
      
      onOpenChange(false);
      setCancelReason('');
      toast.success('Đã hủy phiếu bảo hành');
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      toast.error('Không thể hủy phiếu');
    }
  }, [ticket, cancelReason, updateWarranty, currentUser, findById, onOpenChange, orders, onCancelled, allPayments, receipts, updateOrder, updatePayment, updateReceipt]);

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
          className="min-h-25"
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
