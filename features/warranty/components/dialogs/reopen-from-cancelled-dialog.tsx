/**
 * Reopen From Cancelled Dialog
 * Dialog để mở lại phiếu bảo hành từ trạng thái đã hủy
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
import { useProductStore } from '../../../products/store.ts';
import { useAuth } from '../../../../contexts/auth-context.tsx';
import { toISODateTime, getCurrentDate } from '../../../../lib/date-utils.ts';

interface ReopenFromCancelledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
}

export function ReopenFromCancelledDialog({ open, onOpenChange, ticket }: ReopenFromCancelledDialogProps) {
  const [reopenReason, setReopenReason] = React.useState('');
  const { user: currentUser } = useAuth();
  const { update, findById } = useWarrantyStore();

  const handleReopen = React.useCallback(() => {
    if (!ticket || !reopenReason.trim()) {
      toast.error('Vui lòng nhập lý do mở lại phiếu');
      return;
    }

    try {
      // ✅ RE-COMMIT STOCK: Commit stock again when reopening from cancelled
      const replacedProducts = ticket.products.filter(p => p.resolution === 'replace');
      
      if (replacedProducts.length > 0) {
        const productStore = useProductStore.getState();
        
        replacedProducts.forEach(warrantyProduct => {
          if (!warrantyProduct.sku) {
            console.warn('⚠️ [WARRANTY REOPEN] Product missing SKU:', warrantyProduct.productName);
            return;
          }
          
          const product = productStore.data.find(p => p.id === warrantyProduct.sku);
          
          if (!product) {
            console.warn('⚠️ [WARRANTY REOPEN] Product not found:', warrantyProduct.sku);
            return;
          }
          
          const quantityToCommit = warrantyProduct.quantity || 1;
          
          // Re-commit stock (reserve again)
          productStore.commitStock(product.systemId as any, ticket.branchSystemId as any, quantityToCommit);
          
          console.log('✅ [WARRANTY REOPEN] Re-committed stock:', {
            productId: product.id,
            productName: product.name,
            quantity: quantityToCommit,
            warranty: ticket.id
          });
        });
        
        toast.info('Đã giữ hàng cho phiếu bảo hành', {
          description: `${replacedProducts.length} sản phẩm đã được giữ lại trong kho`,
          duration: 3000
        });
      }
      
      // ✅ Add history entry WITH REASON
      const inventoryNote = replacedProducts.length > 0 
        ? ` (Đã giữ lại ${replacedProducts.length} sản phẩm)` 
        : '';
      
      // ✅ Get latest ticket from store to avoid stale history
      const latestTicket = findById(ticket.systemId);
      if (!latestTicket) {
        toast.error('Không tìm thấy phiếu');
        return;
      }
      
      const newHistory: WarrantyHistory = {
        systemId: `history_${Date.now()}`,
        action: '🔄 Mở lại phiếu từ trạng thái Đã hủy',
        actionLabel: 'Đã mở lại phiếu từ trạng thái Đã hủy',
        entityType: 'status',
        performedBy: currentUser.name,
        performedAt: toISODateTime(getCurrentDate()),
        note: `Lý do mở lại: ${reopenReason}${inventoryNote}`,
      };

      update(ticket.systemId, {
        cancelledAt: undefined,
        status: 'pending', // ✅ Reset to pending (ready to process) instead of incomplete
        returnedAt: undefined, // ✅ Clear returnedAt timestamp
        processedAt: undefined, // ✅ Clear processedAt timestamp
        processingStartedAt: undefined, // ✅ Clear processingStartedAt timestamp
        linkedOrderSystemId: undefined, // ✅ Clear order link
        history: [...latestTicket.history, newHistory],
      });
      
      onOpenChange(false);
      setReopenReason('');
      toast.success('Đã mở lại phiếu bảo hành');
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
      toast.error('Không thể mở lại phiếu');
    }
  }, [ticket, reopenReason, update, currentUser, findById, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận mở lại phiếu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn mở lại phiếu bảo hành này? Vui lòng nhập lý do mở lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={reopenReason}
          onChange={(e) => setReopenReason(e.target.value)}
          placeholder="Nhập lý do mở lại phiếu (bắt buộc)..."
          className="min-h-[100px]"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReopenReason('')}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleReopen}>
            Mở lại
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
