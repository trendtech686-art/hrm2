/**
 * Reopen From Returned Dialog
 * Dialog để mở lại phiếu bảo hành từ trạng thái đã trả/kết thúc
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
import type { WarrantyTicket } from '../../types';
import { useWarrantyMutations } from '../../hooks/use-warranties';
import { useAuth } from '../../../../contexts/auth-context';

interface WarrantyReopenFromReturnedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
}

export function WarrantyReopenFromReturnedDialog({ open, onOpenChange, ticket }: WarrantyReopenFromReturnedDialogProps) {
  const [reopenReason, setReopenReason] = React.useState('');
  const { user: _currentUser } = useAuth();
  const { update } = useWarrantyMutations({
    onUpdateSuccess: () => toast.success('Đã mở lại phiếu bảo hành'),
    onError: (err) => toast.error(err.message)
  });

  const handleReopen = React.useCallback(() => {
    if (!ticket || !reopenReason.trim()) {
      toast.error('Vui lòng nhập lý do mở lại');
      return;
    }

    try {
      // Determine target status based on current status
      const targetStatus = ticket.status === 'completed' ? 'returned' : 'processed';
      
      // ⚠️ KHÔNG ĐỘNG CHẠM GÌ KHI MỞ LẠI TỪ COMPLETED
      // Lý do:
      // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán
      // - Mở lại CHỈ để xem lại, không được sửa/thay đổi gì
      // - Nếu muốn điều chỉnh → Phải thao tác thêm (tạo phiếu mới, hoàn hàng thủ công, etc.)
      if (ticket.status === 'completed') {
        // No-op: Completed tickets are reopened for viewing only
      }
      
      // ✅ Pass lý do mở lại vào note parameter
      (update as any).mutate({ systemId: ticket.systemId, data: { status: targetStatus } });
      
      // Clear returnedAt và linkedOrderSystemId only when going back to processed (not from completed)
      if (targetStatus === 'processed') {
        (update as any).mutate({ systemId: ticket.systemId, data: {
          returnedAt: undefined,
          linkedOrderSystemId: undefined,
        }});
      }
      
      onOpenChange(false);
      setReopenReason('');
      toast.success(`Đã mở lại phiếu`, {
        description: ticket.status === 'completed' 
          ? 'Phiếu đã mở lại để xem. Không thay đổi kho hàng hay thanh toán.' 
          : undefined
      });
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
      toast.error('Không thể mở lại phiếu');
    }
  }, [ticket, reopenReason, update, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận mở lại phiếu đã trả</AlertDialogTitle>
          <AlertDialogDescription>
            Phiếu này đã trả hàng cho khách. Vui lòng nhập lý do cần mở lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={reopenReason}
          onChange={(e) => setReopenReason(e.target.value)}
          placeholder="Nhập lý do mở lại (bắt buộc)..."
          className="min-h-25"
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
